import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetPoolQuery, IPPool } from "../common/pool.dto";
import { IPPoolSchema } from "../zod/pool.zod";
import { Pool } from "./pool.model";
import type { IPoolInput, PoolDoc } from "./pool.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class PoolRepo {
  static async create(ctx: Ctx, data: IPoolInput): Promise<PoolDoc> {
    return new Pool(data).save({ session: ctx?.session }) as unknown as PoolDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<PoolDoc | null> {
    return Pool.findById(id, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetPoolQuery) {
    const { search, sortKey, sortDir, paymentInterval, paymentMode, status } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};

    if (search) {
      queryObject.$or = [
        { $text: { $search: search } },
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    if (paymentInterval) queryObject.paymentInterval = paymentInterval;
    if (status) queryObject.status = status;
    if (paymentMode) queryObject.paymentMode = paymentMode;

    const countQuery = Pool.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = Pool.find<IPPool>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPPoolSchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IPoolInput): Promise<PoolDoc | null> {
    return Pool.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }
}
