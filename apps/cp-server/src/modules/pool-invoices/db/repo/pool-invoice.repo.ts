import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import { transformIds } from "@packages/core/validation";
import type { GetPoolInvoicesQuery, IPPoolInvoice } from "../../common/pool-invoice.dto";
import { IPPoolInvoiceSchema } from "../../zod/pool-invoice.zod";
import { PoolInvoice } from "../models/pool-invoice.model";
import type { IPoolInvoiceInput, PoolInvoiceDoc } from "../types/pool-invoice.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class PoolInvoiceRepo {
  static async create(ctx: Ctx, data: IPoolInvoiceInput): Promise<PoolInvoiceDoc> {
    const invoice = await new PoolInvoice(data).save({ session: ctx?.session });
    return invoice;
  }

  static getById(ctx: Ctx, id: string): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findById(id, {}, { session: ctx?.session });
  }

  static getByIdInPools(ctx: Ctx, id: string, poolIds: string[]): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findOne({ _id: id, pool: { $in: poolIds } }, {}, { session: ctx?.session });
  }

  static getByPoolSlotAndTurn(ctx: Ctx, poolSlotId: string, turnNumber: number): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findOne({ poolSlot: poolSlotId, turnNumber }, {}, { session: ctx?.session });
  }

  static createForPoolSlotTurn(
    ctx: Ctx,
    poolSlotId: string,
    turnNumber: number,
    data: IPoolInvoiceInput
  ): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findOneAndUpdate(
      { poolSlot: poolSlotId, turnNumber },
      { $setOnInsert: data },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true, session: ctx?.session }
    );
  }

  static async getAll(ctx: Ctx, query: GetPoolInvoicesQuery) {
    const { poolId, poolIds, poolSlotId, memberId, status, sortKey, sortDir } = query;
    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);
    const queryObject: Record<string, unknown> = {};

    if (poolIds) {
      const normalizedPoolIds = transformIds(poolIds);
      queryObject.pool = { $in: poolId ? normalizedPoolIds.filter((id) => id === poolId) : normalizedPoolIds };
    } else if (poolId) queryObject.pool = poolId;
    if (poolSlotId) queryObject.poolSlot = poolSlotId;
    if (status) queryObject.status = status;
    if (memberId) {
      queryObject.$or = [{ "sender.member": memberId }, { "receiver.member": memberId }];
    }

    const [data, count] = await Promise.all([
      PoolInvoice.find<IPPoolInvoice>(queryObject, null, { session: ctx?.session })
        .select(parseSelectFromSchema(IPPoolInvoiceSchema))
        .skip(skip)
        .limit(limit)
        .sort(sort),
      PoolInvoice.countDocuments(queryObject, { session: ctx?.session }),
    ]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IPoolInvoiceInput): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findByIdAndUpdate(id, data, { new: true, runValidators: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string): Promise<PoolInvoiceDoc | null> {
    return PoolInvoice.findByIdAndDelete(id, { session: ctx?.session });
  }
}
