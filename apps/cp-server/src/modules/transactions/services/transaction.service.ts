import { AppError, StatusCodes } from "@packages/core/res-config";
import type { GetTransactionsQuery, TransactionInput, ValidateTransactionOptions } from "../common/transaction.dto";
import * as resp from "../common/transaction.res";
import { TransactionUtils } from "../common/transaction.utils";
import { TransactionRepo } from "../db/repo/transaction.repo";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class TransactionService {
  static async createTransaction(ctx: Ctx, data: TransactionInput) {
    const transaction = await TransactionRepo.create(ctx, data);
    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_CREATED };
  }

  static async getTransaction(ctx: Ctx, id: string, options?: ValidateTransactionOptions) {
    let transaction = await TransactionRepo.getById(ctx, id);
    if (options) transaction = TransactionUtils.validateTransaction(transaction, options);
    return { data: transaction ? TransactionUtils.sanitize(transaction) : null };
  }

  static async getTransactions(ctx: Ctx, query: GetTransactionsQuery) {
    const data = await TransactionRepo.getAll(ctx, query);
    return { data };
  }

  static async updateTransaction(ctx: Ctx, id: string, data: TransactionInput) {
    const transaction = await TransactionRepo.update(ctx, id, data);
    if (!transaction) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_UPDATED);
    return { data: TransactionUtils.sanitize(transaction), message: resp.TRANSACTION_UPDATED };
  }

  static async deleteTransaction(ctx: Ctx, id: string) {
    const transaction = await TransactionRepo.delete(ctx, id);
    if (!transaction) throw new AppError(StatusCodes.BAD_REQUEST, resp.TRANSACTION_NOT_DELETED);
    return { message: resp.TRANSACTION_DELETED };
  }
}
