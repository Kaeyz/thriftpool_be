import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetBankAccountQuery, IPBankAccount } from "../common/bank-account.dto";
import { IPBankAccountSchema } from "../zod/bank-account.zod";
import { BankAccount } from "./bank-account.model";
import type { IBankAccountInput, BankAccountDoc } from "./bank-account.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class BankAccountRepo {
  static async create(ctx: Ctx, data: IBankAccountInput): Promise<BankAccountDoc> {
    return new BankAccount(data).save({ session: ctx?.session }) as unknown as BankAccountDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<BankAccountDoc | null> {
    return BankAccount.findById(id, {}, { session: ctx?.session });
  }

  static getAccountByAccountAsh(ctx: Ctx, accountHash: string): Promise<BankAccountDoc | null> {
    return BankAccount.findOne({ accountHash }, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetBankAccountQuery) {
    const { search, sortKey, sortDir, userId } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};

    if (search) {
      queryObject.$or = [{ $text: { $search: search } }, { "accountDetail.number": new RegExp(search, "i") }];
    }

    if (userId) queryObject.user = userId;

    const countQuery = BankAccount.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = BankAccount.find<IPBankAccount>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPBankAccountSchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IBankAccountInput): Promise<BankAccountDoc | null> {
    return BankAccount.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }
}
