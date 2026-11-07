import { AppError, StatusCodes } from "@packages/core/res-config";
import type {
  GetBankAccountHistoryQuery,
  BankAccountHistoryInput,
  ValidateBankAccountHistoryOptions,
} from "../common/bank-account-history.dto";
import * as resp from "../common/bank-account-history.res";
import { BankAccountHistoryUtils } from "../common/bank-account-history.utils";
import { BankAccountHistoryRepo } from "../db/repo/bank-account-history.repo";
import type { BankAccountHistoryDoc, IBankAccountHistoryInput } from "../db/types/bank-account-history.types";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { TransactionService } from "@/modules/transactions";

export class BankAccountHistoryService {
  static async recordTransaction(ctx: Ctx, transactionId: string) {
    const { data: transaction } = await TransactionService.getTransaction(ctx, transactionId);
    if (!transaction) throw new AppError(StatusCodes.NOT_FOUND, resp.TRANSACTION_NOT_FOUND);
    if (transaction.status !== "completed") {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_COMPLETED);
    }
    if (!transaction.fromBankAccount && !transaction.toBankAccount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_WITHOUT_BANK_ACCOUNT);
    }

    const occurredAt = transaction.completedAt ?? new Date();
    const historyEntries: IBankAccountHistoryInput[] = [];

    if (transaction.fromBankAccount) {
      historyEntries.push({
        bankAccount: transaction.fromBankAccount,
        transaction: transaction.id,
        type: "outflow",
        amount: transaction.amount,
        currencyCode: transaction.currencyCode,
        description: transaction.description,
        occurredAt,
      });
    }

    if (transaction.toBankAccount) {
      historyEntries.push({
        bankAccount: transaction.toBankAccount,
        transaction: transaction.id,
        type: "inflow",
        amount: transaction.amount,
        currencyCode: transaction.currencyCode,
        description: transaction.description,
        occurredAt,
      });
    }

    const entries = await Promise.all(historyEntries.map((entry) => BankAccountHistoryRepo.createIfMissing(ctx, entry)));
    if (entries.some((entry) => !entry)) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_HISTORY_NOT_RECORDED);
    }

    const recordedEntries = entries.filter((entry): entry is BankAccountHistoryDoc => entry !== null);
    return {
      data: recordedEntries.map(BankAccountHistoryUtils.sanitize),
      message: resp.BANK_ACCOUNT_HISTORY_RECORDED,
    };
  }

  static async createBankAccountHistory(ctx: Ctx, data: BankAccountHistoryInput) {
    const entry = await BankAccountHistoryRepo.create(ctx, data);
    return { data: BankAccountHistoryUtils.sanitize(entry), message: resp.BANK_ACCOUNT_HISTORY_CREATED };
  }

  static async getBankAccountHistoryEntry(ctx: Ctx, id: string, options?: ValidateBankAccountHistoryOptions) {
    let entry = await BankAccountHistoryRepo.getById(ctx, id);
    if (options) entry = BankAccountHistoryUtils.validateBankAccountHistory(entry, options);
    return { data: entry ? BankAccountHistoryUtils.sanitize(entry) : null };
  }

  static async getBankAccountHistory(ctx: Ctx, query: GetBankAccountHistoryQuery) {
    const data = await BankAccountHistoryRepo.getAll(ctx, query);
    return { data };
  }

  static async updateBankAccountHistory(ctx: Ctx, id: string, data: BankAccountHistoryInput) {
    const entry = await BankAccountHistoryRepo.update(ctx, id, data);
    if (!entry) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_HISTORY_NOT_UPDATED);
    return { data: BankAccountHistoryUtils.sanitize(entry), message: resp.BANK_ACCOUNT_HISTORY_UPDATED };
  }

  static async deleteBankAccountHistory(ctx: Ctx, id: string) {
    const entry = await BankAccountHistoryRepo.delete(ctx, id);
    if (!entry) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_HISTORY_NOT_DELETED);
    return { message: resp.BANK_ACCOUNT_HISTORY_DELETED };
  }
}
