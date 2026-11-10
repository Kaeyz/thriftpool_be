import { AccountType } from "@packages/core/enums";
import { AppError, StatusCodes } from "@packages/core/res-config";
import type { MediaFile } from "@packages/core/types";
import { transformIds } from "@packages/core/validation";
import type {
  GetTransactionsQuery,
  GetMyTransactionsQuery,
  TransactionDecisionInput,
  TransactionInput,
  TransactionRegistrationInput,
  ValidateTransactionOptions,
} from "../common/transaction.dto";
import * as resp from "../common/transaction.res";
import { TransactionUtils } from "../common/transaction.utils";
import { TransactionRepo } from "../db/repo/transaction.repo";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { discordService } from "@/lib/helpers/discord";
import { BankAccountHistoryService } from "@/modules/bank-account-history";
import { CommunityMemberService } from "@/modules/community-members";
import { PoolInvoiceService } from "@/modules/pool-invoices";
import { PoolService } from "@/modules/pools";

export class TransactionService {
  static async createTransaction(ctx: Ctx, data: TransactionInput) {
    const transaction = await TransactionRepo.create(ctx, data);
    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_CREATED };
  }

  static async registerTransaction(ctx: Ctx, data: TransactionRegistrationInput) {
    const { data: invoice } = await PoolInvoiceService.getPoolInvoice(ctx, data.invoice, { notFound: true });
    if (!invoice) throw new AppError(StatusCodes.NOT_FOUND, resp.TRANSACTION_INVOICE_NOT_PAYABLE);
    if (invoice.sender.member.id !== ctx.communityMember?.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.TRANSACTION_SENDER_ONLY);
    }
    if (invoice.status !== "pending" && invoice.status !== "partially_paid") {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_INVOICE_NOT_PAYABLE);
    }

    const unsettledAmount = await TransactionRepo.getUnsettledAmountByInvoice(ctx, invoice.id);
    const remainingAmount = invoice.amount - (invoice.remittedAmount ?? 0) - unsettledAmount;
    void discordService.sendMessage("serverLogs", {
      data: {
        remainingAmount,
        unsettledAmount,
        invoiceAmount: invoice.amount,
        invoiceId: invoice.id,
        transactionAmount: data.amount,
      },
      type: "transaction_registration",
      env: "dev",
      subject: "Transaction Registration Attempt",
    });
    if (data.amount > remainingAmount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_AMOUNT_EXCEEDS_BALANCE);
    }

    const requiresProof = invoice.receiver.accountType === AccountType.BankAccount;
    const transaction = await TransactionRepo.create(ctx, {
      invoice: invoice.id,
      fromBankAccount: invoice.sender.bankAccount.id,
      toBankAccount: invoice.receiver.bankAccount.id,
      amount: data.amount,
      currencyCode: invoice.currencyCode,
      status: requiresProof ? "awaiting_proof" : "pending_approval",
      ...(data.reference ? { reference: data.reference } : {}),
    });

    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_CREATED };
  }

  static async getTransaction(ctx: Ctx, id: string, options?: ValidateTransactionOptions) {
    let transaction = await TransactionRepo.getById(ctx, id);
    if (options) transaction = TransactionUtils.validateTransaction(transaction, options);
    return {
      data: transaction ? TransactionUtils.sanitize(transaction) : null,
      message: resp.TRANSACTION_RETRIEVED,
    };
  }

  static async getTransactions(ctx: Ctx, query: GetTransactionsQuery) {
    const { data: poolIds } = await PoolService.getCommunityPoolIds(ctx);
    const requestedPoolIds = query.poolId ? transformIds(query.poolId) : undefined;
    const scopedPoolIds = requestedPoolIds ? poolIds.filter((poolId) => requestedPoolIds.includes(poolId)) : poolIds;
    const isCommunityAdmin = ["owner", "admin"].includes(ctx.communityMember?.role || "");
    const { data: accessibleInvoiceIds } = await PoolInvoiceService.getPoolInvoiceIds(
      ctx,
      scopedPoolIds,
      isCommunityAdmin ? undefined : ctx.communityMember?.id,
      query.poolSlotId
    );
    const normalizedAccessibleInvoiceIds = transformIds(accessibleInvoiceIds);
    const invoiceIds = query.invoiceIds
      ? transformIds(query.invoiceIds).filter((invoiceId) => normalizedAccessibleInvoiceIds.includes(invoiceId))
      : normalizedAccessibleInvoiceIds;
    const data = await TransactionRepo.getAll(ctx, { ...query, invoiceIds });
    return { data, message: resp.TRANSACTIONS_RETRIEVED };
  }

  static async getMyTransactions(ctx: Ctx, query: GetMyTransactionsQuery) {
    const { data: memberIds } = await CommunityMemberService.getCommunityMemberIdsByUser(ctx, ctx.loggedInUser?.id || "");
    const { data: userInvoiceIds } = await PoolInvoiceService.getPoolInvoiceIdsByMembers(ctx, memberIds);
    const normalizedUserInvoiceIds = transformIds(userInvoiceIds);
    const data = await TransactionRepo.getAll(ctx, { ...query, invoiceIds: normalizedUserInvoiceIds });
    return { data, message: resp.MY_TRANSACTIONS_RETRIEVED };
  }

  static async getTransactionForCurrentMember(ctx: Ctx, id: string, options?: ValidateTransactionOptions) {
    let transaction = await TransactionRepo.getById(ctx, id);
    if (options) transaction = TransactionUtils.validateTransaction(transaction, options);
    if (!transaction) return { data: null, message: resp.TRANSACTION_RETRIEVED };

    const { data: invoice } = await PoolInvoiceService.getPoolInvoice(ctx, transaction.invoice.toString());
    if (!invoice) throw new AppError(StatusCodes.NOT_FOUND, resp.TRANSACTION_NOT_FOUND);
    const memberId = ctx.communityMember?.id;
    const isCommunityAdmin = ["owner", "admin"].includes(ctx.communityMember?.role || "");
    if (!isCommunityAdmin && invoice.sender.member.id !== memberId && invoice.receiver.member.id !== memberId) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.TRANSACTION_NOT_FOUND);
    }

    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_RETRIEVED };
  }

  static async decideTransaction(ctx: Ctx, id: string, decision: TransactionDecisionInput) {
    const transaction = await TransactionRepo.getById(ctx, id);
    if (!transaction) throw new AppError(StatusCodes.NOT_FOUND, resp.TRANSACTION_NOT_FOUND);
    if (transaction.status !== "pending_approval") {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_PENDING_APPROVAL);
    }

    const { data: invoice } = await PoolInvoiceService.getPoolInvoice(ctx, transaction.invoice.toString(), { notFound: true });
    if (!invoice) throw new AppError(StatusCodes.NOT_FOUND, resp.TRANSACTION_NOT_FOUND);
    if (invoice.receiver.member.id !== ctx.communityMember?.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.TRANSACTION_RECEIVER_ONLY);
    }

    if (decision.decision === "reject") {
      const rejected = await TransactionRepo.updateByStatus(ctx, id, "pending_approval", {
        status: "rejected",
        rejectionReason: decision.rejectionReason,
      });
      if (!rejected) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_PENDING_APPROVAL);
      return { data: TransactionUtils.sanitize(rejected), message: resp.TRANSACTION_DECISION_SAVED };
    }

    if (invoice.receiver.accountType === AccountType.BankAccount && !transaction.proof) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_PROOF_REQUIRED);
    }

    const completed = await TransactionRepo.updateByStatus(ctx, id, "pending_approval", {
      status: "completed",
      completedAt: new Date(),
    });
    if (!completed) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_PENDING_APPROVAL);

    const updatedInvoice = await PoolInvoiceService.applyInvoiceRemittance(ctx, invoice.id, completed.id, completed.amount);
    if (!updatedInvoice) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_AMOUNT_EXCEEDS_BALANCE);

    const sanitizedTransaction = TransactionUtils.sanitize(completed);
    await BankAccountHistoryService.recordTransaction(ctx, sanitizedTransaction);
    return { data: sanitizedTransaction, message: resp.TRANSACTION_DECISION_SAVED };
  }

  static async validateProofUpload(ctx: Ctx, transactionId: string) {
    const transaction = await TransactionRepo.getById(ctx, transactionId);
    if (!transaction) return { status: false, message: resp.TRANSACTION_NOT_FOUND };
    if (transaction.status !== "awaiting_proof") {
      return { status: false, message: resp.TRANSACTION_PROOF_NOT_ALLOWED };
    }

    const { data: invoice } = await PoolInvoiceService.getPoolInvoice(ctx, transaction.invoice.toString());
    if (!invoice) return { status: false, message: resp.TRANSACTION_NOT_FOUND };
    if (invoice.status !== "pending" && invoice.status !== "partially_paid") {
      return { status: false, message: resp.TRANSACTION_INVOICE_NOT_PAYABLE };
    }
    if (invoice.sender.member.id !== ctx.communityMember?.id) {
      return { status: false, message: resp.TRANSACTION_SENDER_ONLY };
    }

    return { status: true, message: "Valid transaction proof upload" };
  }

  static async submitTransactionProof(ctx: Ctx, transactionId: string, proof: MediaFile) {
    const validation = await TransactionService.validateProofUpload(ctx, transactionId);
    if (!validation.status) throw new AppError(StatusCodes.BAD_REQUEST, validation.message);

    const transaction = await TransactionRepo.updateByStatus(ctx, transactionId, "awaiting_proof", {
      proof,
      status: "pending_approval",
    });
    if (!transaction) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_PROOF_NOT_ALLOWED);
    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_PROOF_UPLOADED };
  }

  static async updateTransaction(ctx: Ctx, id: string, data: TransactionInput) {
    const transaction = await TransactionRepo.update(ctx, id, data);
    if (!transaction) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_UPDATED);
    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_UPDATED };
  }

  static async deleteTransaction(ctx: Ctx, id: string) {
    const transaction = await TransactionRepo.delete(ctx, id);
    if (!transaction) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_DELETED);
    return { data: null, message: resp.TRANSACTION_DELETED };
  }
}
