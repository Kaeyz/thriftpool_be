import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetCommunityMembersQuery, IPCommunityMember } from "../common/community-member.dto";
import { IPCommunityMemberSchema } from "../zod/community-member.zod";
import { CommunityMember } from "./community-member.model";
import type { ICommunityMemberInput, CommunityMemberDoc } from "./community-member.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class CommunityMemberRepo {
  static async create(ctx: Ctx, data: ICommunityMemberInput): Promise<CommunityMemberDoc> {
    return new CommunityMember(data).save({ session: ctx?.session }) as unknown as CommunityMemberDoc;
  }

  static async getByUserId(ctx: Ctx, data: { communityId: string; userId: string }): Promise<CommunityMemberDoc | null> {
    return CommunityMember.findOne({ community: data.communityId, user: data.userId }, {}, { session: ctx?.session });
  }

  static getById(ctx: Ctx, id: string): Promise<CommunityMemberDoc | null> {
    return CommunityMember.findById(id, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetCommunityMembersQuery) {
    const { sortKey, sortDir, role, communityId, userId, status } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};
    const orConditions = [];

    if (role) queryObject.role = role;
    if (status) queryObject.status = status;
    if (communityId) queryObject.community = communityId;
    if (userId) orConditions.push({ user: userId });

    if (orConditions.length > 0) queryObject.$or = orConditions;
    const countQuery = CommunityMember.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = CommunityMember.find<IPCommunityMember>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPCommunityMemberSchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: ICommunityMemberInput): Promise<CommunityMemberDoc | null> {
    return CommunityMember.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }
}
