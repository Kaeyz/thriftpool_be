import { AppError, StatusCodes } from "@packages/core/res-config";
import type { BankAccountHistoryDoc } from "../db/types/bank-account-history.types";
import type { ISBankAccountHistory, ValidateBankAccountHistoryOptions } from "./bank-account-history.dto";
import { BANK_ACCOUNT_HISTORY_NOT_FOUND } from "./bank-account-history.res";

export class BankAccountHistoryUtils {
  static sanitize(entry: BankAccountHistoryDoc): ISBankAccountHistory {
    const obj = entry.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISBankAccountHistory;
  }

  static validateBankAccountHistory(entry: BankAccountHistoryDoc | null, options: ValidateBankAccountHistoryOptions) {
    if (options.notFound && !entry) throw new AppError(StatusCodes.NOT_FOUND, BANK_ACCOUNT_HISTORY_NOT_FOUND);
    if (options.type && entry?.type !== options.type) {
      throw new AppError(StatusCodes.BAD_REQUEST, `Bank account history type must be ${options.type}`);
    }
    return entry;
  }
}
