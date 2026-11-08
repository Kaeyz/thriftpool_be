import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetAllOptions } from "@packages/core/types";
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

  static getByPosition(ctx: Ctx, poolId: string, position: number): Promise<PoolSlotDoc | null> {
    return PoolSlot.findOne({ pool: poolId, position }, {}, { session: ctx?.session });
  }

  static getActiveByPool(ctx: Ctx, poolId: string): Promise<PoolSlotDoc | null> {
    return PoolSlot.findOne({ pool: poolId, "cycleState.state": "active" }, {}, { session: ctx?.session });
  }

  static completeActiveCycle(ctx: Ctx, poolId: string, poolSlotId: string, endedAt: number): Promise<PoolSlotDoc | null> {
    return PoolSlot.findOneAndUpdate(
      { _id: poolSlotId, pool: poolId, "cycleState.state": "active" },
      {
        $set: {
          "cycleState.state": "completed",
          "cycleState.endDate": endedAt,
          endedDate: endedAt,
        },
      },
      { new: true, session: ctx?.session }
    );
  }

  static activateCycle(
    ctx: Ctx,
    poolId: string,
    poolSlotId: string,
    startDate: number,
    endDate: number
  ): Promise<PoolSlotDoc | null> {
    return PoolSlot.findOneAndUpdate(
      { _id: poolSlotId, pool: poolId, "cycleState.state": { $ne: "active" } },
      {
        $set: {
          startDate,
          cycleState: { state: "active", startDate, endDate },
        },
      },
      { new: true, session: ctx?.session }
    );
  }

  static getOtherSlotForMember(ctx: Ctx, poolId: string, memberId: string, excludedSlotId: string): Promise<PoolSlotDoc | null> {
    return PoolSlot.findOne(
      { pool: poolId, _id: { $ne: excludedSlotId }, "slotOwner.member": memberId },
      {},
      { session: ctx?.session }
    );
  }

  static async getAll(ctx: Ctx, query: GetPoolSlotQuery, options: GetAllOptions = {}) {
    const { sortKey, sortDir, poolId } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};

    if (poolId) queryObject.pool = poolId;

    const countQuery = PoolSlot.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = PoolSlot.find<IPPoolSlot>(queryObject, null, { session: ctx?.session }).select(
      parseSelectFromSchema(IPPoolSlotSchema)
    );
    if (options.paginate !== false) dataQuery.skip(skip).limit(limit);
    dataQuery.sort(sort);

    let data: IPPoolSlot[];
    let count: number;
    if (ctx?.session) {
      data = await dataQuery;
      count = await countQuery;
    } else {
      [data, count] = await Promise.all([dataQuery, countQuery]);
    }

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IPoolSlotInput, unsetPaymentInfo = false): Promise<PoolSlotDoc | null> {
    const update = unsetPaymentInfo ? { $set: data, $unset: { paymentInfo: 1 } } : data;
    return PoolSlot.findByIdAndUpdate(id, update, { new: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string): Promise<PoolSlotDoc | null> {
    return PoolSlot.findByIdAndDelete(id, { new: true, session: ctx?.session });
  }
}
