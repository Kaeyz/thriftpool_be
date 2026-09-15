import { AppError, StatusCodes } from "@packages/core/res-config";
import type { CommunityInput, GetCommunityQuery, IPCommunity, ValidateCommunityOptions } from "../common/community.dto";
import * as resp from "../common/community.res";
import { CommunityRepo } from "../db/community.repo";
import { CommunityUtils } from "./community.utils";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { CommunityMemberService } from "@/modules/community-members";

export class CommunityService {
  static async createCommunity(ctx: Ctx, newCommunity: CommunityInput) {
    const userId = ctx?.loggedInUser?.id || "";

    const communityExist = await CommunityRepo.getByKey(ctx, newCommunity.key);
    if (communityExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_WITH_KEY_EXIST);

    const community = await CommunityRepo.create(ctx, {
      name: newCommunity.name,
      key: newCommunity.key,
      description: newCommunity.description,
      visibility: newCommunity.visibility,
    });

    await CommunityMemberService.createCommunityMember(ctx, { userId, communityId: community.id, role: "owner" });
    return { data: CommunityUtils.sanitize(community), message: resp.COMMUNITY_CREATED };
  }

  static async getCommunity(ctx: Ctx, id: string, options?: ValidateCommunityOptions) {
    let community = await CommunityRepo.getById(ctx, id);
    if (options) community = CommunityUtils.validateCommunity(community, options);
    return { data: community ? CommunityUtils.sanitize(community) : null };
  }

  static async getCommunityByKey(ctx: Ctx, key: string, options?: ValidateCommunityOptions) {
    let community = await CommunityRepo.getByKey(ctx, key);
    if (options) community = CommunityUtils.validateCommunity(community, options);
    return { data: community ? CommunityUtils.sanitize(community) : null };
  }

  static async updateCommunity(ctx: Ctx, communityId: string, updateData: CommunityInput) {
    let community = await CommunityRepo.getById(ctx, communityId);
    CommunityUtils.validateCommunity(community);

    if (updateData?.key !== community?.key) {
      const communityExist = await CommunityRepo.getByKey(ctx, updateData.key);
      if (communityExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_WITH_KEY_EXIST);
    }

    community = await CommunityRepo.update(ctx, communityId, {
      name: updateData.name,
      key: updateData.key,
      description: updateData.description,
      visibility: updateData.visibility,
    });

    if (!community) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_NOT_UPDATED);
    return { data: CommunityUtils.sanitize(community), message: resp.COMMUNITY_UPDATED };
  }

  static async getMyCommunities(ctx: Ctx, query: GetCommunityQuery) {
    const userId = ctx?.loggedInUser?.id || "";

    const { data: communityMembers } = await CommunityMemberService.getCommunityMembers(ctx, {
      limit: query.limit,
      page: query.page,
      status: "accepted",
      userId,
    });

    let queryResponse = {
      data: [] as IPCommunity[],
      limit: communityMembers.limit,
      count: communityMembers.count,
      page: communityMembers.page,
    };

    if (communityMembers.count > 0) {
      const communityIds = communityMembers.data.map((v) => v.community.id);
      const communities = await CommunityRepo.getAll(ctx, {
        search: query.search,
        communityIds,
        limit: communityIds.length,
        isSuspended: "false",
      });

      queryResponse = { ...queryResponse, data: communities.data };
    }

    return { data: queryResponse };
  }
}
