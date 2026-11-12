import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import { generateUniqueRef } from "@packages/core/helpers";
import type { GetAllOptions } from "@packages/core/types";
import { transformIds } from "@packages/core/validation";
import type { GetPoolInvoicesQuery, IPPoolInvoice } from "../../common/pool-invoice.dto";
import { IPPoolInvoiceSchema } from "../../zod/pool-invoice.zod";
import { PoolInvoice } from "../models/pool-invoice.model";
import type { IPoolInvoiceInput, PoolInvoiceDoc } from "../types/pool-invoice.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class PoolInvoiceRepo {
  static async create(ctx: Ctx, data: IPoolInvoiceInput): Promise<PoolInvoiceDoc> {
    return new PoolInvoice({ ...data, ref: generateUniqueRef("PNV") }).save({
      session: ctx?.session,
    }) as unknown as PoolInvoiceDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findById(id, {}, { session: ctx?.session });
  }

  static getByIdInPools(ctx: Ctx, id: string, poolIds: string[]): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findOne({ _id: id, pool: { $in: transformIds(poolIds) } }, {}, { session: ctx?.session });
  }

  static getByPoolSlotAndTurn(ctx: Ctx, poolSlotId: string, turnNumber: number): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findOne({ poolSlot: poolSlotId, turnNumber }, {}, { session: ctx?.session });
  }

  static async getIdsByPools(ctx: Ctx, poolIds: string[], memberId?: string, poolSlotId?: string): Promise<string[]> {
    const query: Record<string, unknown> = { pool: { $in: transformIds(poolIds) } };
    if (memberId) {
      query.$or = [{ "sender.member": memberId }, { "receiver.member": memberId }];
    }
    if (poolSlotId) query.poolSlot = poolSlotId;

    const ids = await PoolInvoice.find(query, { _id: 1 }, { session: ctx?.session }).distinct("_id");
    return ids.map((id) => id.toString());
  }

  static async getIdsByMembers(ctx: Ctx, memberIds: string[], poolId?: string, poolSlotId?: string): Promise<string[]> {
    const normalizedMemberIds = transformIds(memberIds);
    const query: Record<string, unknown> = {
      $or: [{ "sender.member": { $in: normalizedMemberIds } }, { "receiver.member": { $in: normalizedMemberIds } }],
    };
    if (poolId) query.pool = poolId;
    if (poolSlotId) query.poolSlot = poolSlotId;

    const ids = await PoolInvoice.find(query, { _id: 1 }, { session: ctx?.session }).distinct("_id");
    return ids.map((id) => id.toString());
  }

  static createForPoolSlotTurn(
    ctx: Ctx,
    poolSlotId: string,
    turnNumber: number,
    data: IPoolInvoiceInput
  ): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findOneAndUpdate(
      { poolSlot: poolSlotId, turnNumber },
      { $setOnInsert: { ...data, ref: generateUniqueRef("PNV") } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true, session: ctx?.session }
    );
  }

  static async applyRemittance(
    ctx: Ctx,
    invoiceId: string,
    transactionId: string,
    amount: number
  ): Promise<PoolInvoiceDoc | null> {
    const invoice = await PoolInvoice.findOneAndUpdate(
      {
        _id: invoiceId,
        status: { $in: ["pending", "partially_paid"] },
        $expr: {
          $lte: [{ $add: [{ $ifNull: ["$remittedAmount", 0] }, amount] }, "$amount"],
        },
      },
      {
        $inc: { remittedAmount: amount },
        $addToSet: { transactions: transactionId },
      },
      { new: true, runValidators: true, session: ctx?.session }
    );
    if (!invoice) return null;

    const isPaid = (invoice.remittedAmount ?? 0) >= invoice.amount;
    return PoolInvoice.findByIdAndUpdate(
      invoiceId,
      {
        $set: { status: isPaid ? "paid" : "partially_paid", ...(isPaid ? { paidAt: new Date() } : {}) },
        ...(!isPaid ? { $unset: { paidAt: 1 } } : {}),
      },
      { new: true, runValidators: true, session: ctx?.session }
    );
  }

  static async getAll(ctx: Ctx, query: GetPoolInvoicesQuery, options: GetAllOptions = {}) {
    const { poolId, poolIds, poolSlotId, memberId, status, turnNumber, sortKey, sortDir } = query;
    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);
    const queryObject: Record<string, unknown> = {};

    if (poolIds) {
      const normalizedPoolIds = transformIds(poolIds);
      queryObject.pool = { $in: poolId ? normalizedPoolIds.filter((id) => id === poolId) : normalizedPoolIds };
    } else if (poolId) queryObject.pool = poolId;
    if (poolSlotId) queryObject.poolSlot = poolSlotId;
    if (status) queryObject.status = status;
    if (turnNumber) queryObject.turnNumber = turnNumber;
    if (memberId) {
      queryObject.$or = [{ "sender.member": memberId }, { "receiver.member": memberId }];
    }

    const dataQuery = PoolInvoice.find<IPPoolInvoice>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPPoolInvoiceSchema))
      .sort(sort);
    if (options.paginate !== false) dataQuery.skip(skip).limit(limit);

    const countQuery = PoolInvoice.countDocuments(queryObject, { session: ctx?.session });
    let data: IPPoolInvoice[];
    let count: number;
    if (ctx?.session) {
      data = await dataQuery;
      count = await countQuery;
    } else {
      [data, count] = await Promise.all([dataQuery, countQuery]);
    }

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IPoolInvoiceInput): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findByIdAndUpdate(id, data, { new: true, runValidators: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findByIdAndDelete(id, { session: ctx?.session });
  }
}
