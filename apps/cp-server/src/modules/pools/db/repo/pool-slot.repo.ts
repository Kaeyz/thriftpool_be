import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetPoolSlotQuery, IPPoolSlot } from "../../common/pool-slot.dto";
import { IPPoolSlotSchema } from "../../zod/pool-slot.zod";
import { PoolSlot } from "../models/pool-slot.model";
import type { IPoolSlotInput, PoolSlotDoc } from "../types/pool-slot.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class PoolSlotRepo {
  static async create(ctx: Ctx, data: IPoolSlotInput): Promise<PoolSlotDoc> {
    return new PoolSlot(data).save({ session: ctx?.session }) as unknown as PoolSlotDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<PoolSlotDoc | null> {
    return PoolSlot.findById(id, {}, { session: ctx?.session });
  }

  static getByPosition(ctx: Ctx, poolId: string, position: number) {
    return PoolSlot.findOne({ pool: poolId, position }, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetPoolSlotQuery) {
    const { sortKey, sortDir, poolId } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};

    if (poolId) queryObject.pool = poolId;

    const countQuery = PoolSlot.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = PoolSlot.find<IPPoolSlot>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPPoolSlotSchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IPoolSlotInput): Promise<PoolSlotDoc | null> {
    return PoolSlot.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string): Promise<PoolSlotDoc | null> {
    return PoolSlot.findByIdAndDelete(id, { new: true, session: ctx?.session });
  }
}
