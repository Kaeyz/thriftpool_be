import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetBankAccountHistoryQuery, IPBankAccountHistory } from "../../common/bank-account-history.dto";
import { IPBankAccountHistorySchema } from "../../zod/bank-account-history.zod";
import { BankAccountHistory } from "../models/bank-account-history.model";
import type { IBankAccountHistoryInput, BankAccountHistoryDoc } from "../types/bank-account-history.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class BankAccountHistoryRepo {
  static async create(ctx: Ctx, data: IBankAccountHistoryInput): Promise<BankAccountHistoryDoc> {
    return new BankAccountHistory(data).save({ session: ctx?.session }) as unknown as BankAccountHistoryDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<BankAccountHistoryDoc | null> {
    return BankAccountHistory.findById(id, {}, { session: ctx?.session });
  }

  static getByTransaction(ctx: Ctx, transactionId: string): Promise<BankAccountHistoryDoc[]> {
    return BankAccountHistory.find({ transaction: transactionId }, {}, { session: ctx?.session }).sort({ occurredAt: 1 });
  }

  static getByBankAccount(ctx: Ctx, bankAccountId: string): Promise<BankAccountHistoryDoc[]> {
    return BankAccountHistory.find({ bankAccount: bankAccountId }, {}, { session: ctx?.session }).sort({ occurredAt: -1 });
  }

  static async createIfMissing(ctx: Ctx, data: IBankAccountHistoryInput): Promise<BankAccountHistoryDoc> {
    const historyEntry = await BankAccountHistory.findOneAndUpdate(
      { bankAccount: data.bankAccount, transaction: data.transaction, type: data.type },
      { $setOnInsert: data },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true, session: ctx?.session }
    );
    if (!historyEntry) throw new Error("Bank account history upsert did not return a document");
    return historyEntry;
  }

  static async getAll(ctx: Ctx, query: GetBankAccountHistoryQuery) {
    const { bankAccountId, transactionId, type, sortKey, sortDir } = query;
    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);
    const queryObject: Record<string, unknown> = {};

    if (bankAccountId) queryObject.bankAccount = bankAccountId;
    if (transactionId) queryObject.transaction = transactionId;
    if (type) queryObject.type = type;

    const [data, count] = await Promise.all([
      BankAccountHistory.find<IPBankAccountHistory>(queryObject, null, { session: ctx?.session })
        .select(parseSelectFromSchema(IPBankAccountHistorySchema))
        .skip(skip)
        .limit(limit)
        .sort(sort),
      BankAccountHistory.countDocuments(queryObject, { session: ctx?.session }),
    ]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IBankAccountHistoryInput): Promise<BankAccountHistoryDoc | null> {
    return BankAccountHistory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session: ctx?.session,
    });
  }

  static delete(ctx: Ctx, id: string): Promise<BankAccountHistoryDoc | null> {
    return BankAccountHistory.findByIdAndDelete(id, { session: ctx?.session });
  }
}
