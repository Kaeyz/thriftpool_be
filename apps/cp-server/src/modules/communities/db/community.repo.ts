import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import { transformIds } from "@packages/core/validation";
import type { GetCommunityQuery, IPCommunity } from "../common/community.dto";
import { IPCommunitySchema } from "../zod/community.zod";
import { Community } from "./community.model";
import type { ICommunityInput, CommunityDoc } from "./community.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class CommunityRepo {
  static async create(ctx: Ctx, data: ICommunityInput): Promise<CommunityDoc> {
    return new Community(data).save({ session: ctx?.session }) as unknown as CommunityDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<CommunityDoc | null> {
    return Community.findById(id, {}, { session: ctx?.session });
  }

  static getByKey(ctx: Ctx, key: string): Promise<CommunityDoc | null> {
    return Community.findOne({ key }, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetCommunityQuery) {
    const { search, isSuspended, sortKey, sortDir, communityIds, visibility } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};

    if (search) {
      queryObject.$or = [
        { $text: { $search: search } },
        { name: new RegExp(search, "i") },
        { key: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    if (communityIds) {
      const normalizedIds = transformIds(communityIds);
      if (normalizedIds.length > 0) queryObject._id = { $in: normalizedIds };
    }
    if (visibility) queryObject.visibility = visibility;
    if (isSuspended === "true") queryObject.isSuspended = true;
    if (isSuspended === "false") queryObject.isSuspended = false;

    const countQuery = Community.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = Community.find<IPCommunity>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPCommunitySchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: ICommunityInput): Promise<CommunityDoc | null> {
    return Community.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }
}
