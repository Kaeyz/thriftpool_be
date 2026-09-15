import { Ctx } from "@/lib/ctx";
import { buildPagination, buildSortObject, transformIds, parseSelectFromSchema } from "@/lib/helpers";
import { GetMinistriesQuery, IPMinistry } from "../common/ministry.dto";
import { IPMinistrySchema } from "../zod/ministry.zod";
import { Ministry } from "./ministry.model";
import { IMinistryInput, MinistryDoc } from "./ministry.types";

export class MinistryRepo {
  static async create(ctx: Ctx, data: IMinistryInput): Promise<MinistryDoc> {
    return new Ministry(data).save({ session: ctx?.session }) as unknown as MinistryDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<MinistryDoc | null> {
    return Ministry.findById(id, {}, { session: ctx?.session });
  }

  static getByKey(ctx: Ctx, key: string): Promise<MinistryDoc | null> {
    return Ministry.findOne({ key }, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetMinistriesQuery) {
    const { search, isSuspended, sortKey, sortDir, ministryIds } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};

    if (search) {
      queryObject.$or = [{ $text: { $search: search } }, { name: new RegExp(search, "i") }, { key: new RegExp(search, "i") }];
    }

    if (ministryIds) {
      const normalizedIds = transformIds(ministryIds);
      if (normalizedIds.length > 0) queryObject._id = { $in: normalizedIds };
    }
    if (isSuspended === "true") queryObject.isSuspended = true;
    if (isSuspended === "false") queryObject.isSuspended = false;

    const countQuery = Ministry.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = Ministry.find<IPMinistry>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPMinistrySchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IMinistryInput): Promise<MinistryDoc | null> {
    return Ministry.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }
}
