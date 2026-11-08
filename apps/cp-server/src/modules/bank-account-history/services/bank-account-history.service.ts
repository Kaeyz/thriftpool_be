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
import { BankAccountService } from "@/modules/bank-accounts";
import { BANK_ACCOUNT_NOT_FOUND } from "@/modules/bank-accounts/common/bank-account.res";
import type { ISTransaction } from "@/modules/transactions/common/transaction.dto";

export class BankAccountHistoryService {
  static async recordTransaction(ctx: Ctx, transaction: ISTransaction) {
    if (transaction.status !== "completed") {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_COMPLETED);
    }
    if (!transaction.fromBankAccount || !transaction.toBankAccount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_WITHOUT_BANK_ACCOUNT);
    }

    const occurredAt = transaction.completedAt ? new Date(transaction.completedAt) : new Date();
    const historyEntries: IBankAccountHistoryInput[] = [];

    if (transaction.fromBankAccount) {
      historyEntries.push({
        bankAccount: transaction.fromBankAccount,
        transaction: transaction.id,
        type: "outflow",
        amount: transaction.amount,
        currencyCode: transaction.currencyCode,
        description: transaction.reference,
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
        description: transaction.reference,
        occurredAt,
      });
    }

    const recordedEntries: BankAccountHistoryDoc[] = [];
    for (const entry of historyEntries) {
      const recordedEntry = await BankAccountHistoryRepo.createIfMissing(ctx, entry);
      if (!recordedEntry) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_HISTORY_NOT_RECORDED);
      }
      recordedEntries.push(recordedEntry);
    }

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
    return {
      data: entry ? BankAccountHistoryUtils.sanitize(entry) : null,
      message: resp.BANK_ACCOUNT_HISTORY_RETRIEVED,
    };
  }

  static async getBankAccountHistory(ctx: Ctx, query: GetBankAccountHistoryQuery) {
    const { data: bankAccount } = await BankAccountService.getBankAccount(ctx, query.bankAccountId);
    if (!bankAccount) throw new AppError(StatusCodes.NOT_FOUND, BANK_ACCOUNT_NOT_FOUND);
    if (bankAccount.user !== ctx.loggedInUser?.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.BANK_ACCOUNT_HISTORY_UNAUTHORIZED);
    }

    const data = await BankAccountHistoryRepo.getAll(ctx, query);
    return { data, message: resp.BANK_ACCOUNT_HISTORY_RETRIEVED };
  }

  static async updateBankAccountHistory(ctx: Ctx, id: string, data: BankAccountHistoryInput) {
    const entry = await BankAccountHistoryRepo.update(ctx, id, data);
    if (!entry) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_HISTORY_NOT_UPDATED);
    return { data: BankAccountHistoryUtils.sanitize(entry), message: resp.BANK_ACCOUNT_HISTORY_UPDATED };
  }

  static async deleteBankAccountHistory(ctx: Ctx, id: string) {
    const entry = await BankAccountHistoryRepo.delete(ctx, id);
    if (!entry) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_HISTORY_NOT_DELETED);
    return { data: null, message: resp.BANK_ACCOUNT_HISTORY_DELETED };
  }
}
