import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetCommunityInvitesQuery, IPCommunityInvite } from "../common/community-invite.dto";
import { IPCommunityInviteSchema } from "../zod/community-invite.zod";
import { CommunityInvite } from "./community-invite.model";
import type { ICommunityInviteInput, CommunityInviteDoc } from "./community-invite.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class CommunityInviteRepo {
  static async create(ctx: Ctx, data: ICommunityInviteInput): Promise<CommunityInviteDoc> {
    return new CommunityInvite(data).save({ session: ctx?.session }) as unknown as CommunityInviteDoc;
  }

  static async getByUserId(ctx: Ctx, data: { communityId: string; userId: string }): Promise<CommunityInviteDoc | null> {
    return CommunityInvite.findOne({ community: data.communityId, user: data.userId }, {}, { session: ctx?.session });
  }

  static async getByEmail(ctx: Ctx, data: { communityId: string; emailAddress: string }): Promise<CommunityInviteDoc | null> {
    return CommunityInvite.findOne(
      { community: data.communityId, emailAddress: data.emailAddress },
      {},
      { session: ctx?.session }
    );
  }

  static getById(ctx: Ctx, id: string): Promise<CommunityInviteDoc | null> {
    return CommunityInvite.findById(id, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetCommunityInvitesQuery) {
    const { sortKey, sortDir, communityId, userId, status, emailAddress } = query;

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir);

    const queryObject: Record<string, unknown> = {};
    const orConditions = [];

    if (status) queryObject.status = status;
    if (communityId) queryObject.community = communityId;
    if (userId) orConditions.push({ user: userId });
    if (emailAddress) orConditions.push({ emailAddress });

    if (orConditions.length > 0) queryObject.$or = orConditions;
    const countQuery = CommunityInvite.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = CommunityInvite.find<IPCommunityInvite>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPCommunityInviteSchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: ICommunityInviteInput): Promise<CommunityInviteDoc | null> {
    return CommunityInvite.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string, data: ICommunityInviteInput): Promise<CommunityInviteDoc | null> {
    return CommunityInvite.findByIdAndDelete(id, { new: true, session: ctx?.session });
  }
}
