import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import { transformIds } from "@packages/core/validation";
import type { GetTransactionsQuery, IPTransaction, TransactionStatus } from "../../common/transaction.dto";
import { IPTransactionSchema } from "../../zod/transaction.zod";
import { Transaction } from "../models/transaction.model";
import type { ITransactionInput, TransactionDoc } from "../types/transaction.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class TransactionRepo {
  static async create(ctx: Ctx, data: ITransactionInput): Promise<TransactionDoc> {
    return new Transaction(data).save({ session: ctx?.session }) as unknown as TransactionDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<TransactionDoc | null> {
    return Transaction.findById(id, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetTransactionsQuery) {
    const { invoiceId, invoiceIds = [], status, sortKey, sortDir } = query;
    const normalizedInvoiceIds = transformIds(invoiceIds);
    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);
    const queryObject: Record<string, unknown> = { invoice: { $in: normalizedInvoiceIds } };

    if (invoiceId) {
      const [normalizedInvoiceId] = transformIds(invoiceId);
      queryObject.invoice = normalizedInvoiceIds.includes(normalizedInvoiceId) ? normalizedInvoiceId : { $in: [] };
    }
    if (status) queryObject.status = status;

    const [data, count] = await Promise.all([
      Transaction.find<IPTransaction>(queryObject, null, { session: ctx?.session })
        .select(parseSelectFromSchema(IPTransactionSchema))
        .skip(skip)
        .limit(limit)
        .sort(sort),
      Transaction.countDocuments(queryObject, { session: ctx?.session }),
    ]);

    return { data, count, page, limit };
  }

  static async getUnsettledAmountByInvoice(ctx: Ctx, invoiceId: string): Promise<number> {
    const transactions = await Transaction.find(
      { invoice: invoiceId, status: { $in: ["pending", "awaiting_proof", "pending_approval"] } },
      null,
      { session: ctx?.session }
    );
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  static updateByStatus(
    ctx: Ctx,
    id: string,
    status: TransactionStatus,
    data: ITransactionInput
  ): Promise<TransactionDoc | null> {
    return Transaction.findOneAndUpdate(
      { _id: id, status },
      { $set: data },
      { new: true, runValidators: true, session: ctx?.session }
    );
  }

  static update(ctx: Ctx, id: string, data: ITransactionInput): Promise<TransactionDoc | null> {
    return Transaction.findByIdAndUpdate(id, data, { new: true, runValidators: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string): Promise<TransactionDoc | null> {
    return Transaction.findByIdAndDelete(id, { session: ctx?.session });
  }
}
