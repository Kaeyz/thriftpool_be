import { AppError, StatusCodes } from "@packages/core/res-config";
import type { TransactionDoc } from "../db/types/transaction.types";
import type { ISTransaction, ValidateTransactionOptions } from "./transaction.dto";
import { TRANSACTION_NOT_FOUND } from "./transaction.res";

export class TransactionUtils {
  static sanitize(transaction: TransactionDoc): ISTransaction {
    const obj = transaction.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISTransaction;
  }

  static validateTransaction(transaction: TransactionDoc | null, options: ValidateTransactionOptions) {
    if (options.notFound && !transaction) throw new AppError(StatusCodes.NOT_FOUND, TRANSACTION_NOT_FOUND);
    if (options.status && transaction?.status !== options.status) {
      throw new AppError(StatusCodes.BAD_REQUEST, `Transaction must be ${options.status}`);
    }
    return transaction;
  }
}
