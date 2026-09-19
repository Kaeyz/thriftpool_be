import { AppError, StatusCodes } from "@packages/core/res-config";
import type {
  CommunityMemberInput,
  ValidateCommunityMemberOptions,
  GetCommunityMembersQuery,
  CommunityRoleUpdateInput,
} from "../common/community-member.dto";
import * as resp from "../common/community-member.res";
import { CommunityMemberUtils } from "../common/community-member.utils";
import { CommunityMemberRepo } from "../db/community-member.repo";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { UserService } from "@/modules/users";

export class CommunityMemberService {
  static async createCommunityMember(ctx: Ctx, newMember: CommunityMemberInput) {
    const communityId = ctx?.community?.id || "";
    let member = await CommunityMemberRepo.getByUserId(ctx, { communityId: communityId, userId: newMember.userId });
    if (member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_EXIST);

    await UserService.getUserById(ctx, newMember.userId, { isEmailVerified: true, isSuspended: false });

    member = await CommunityMemberRepo.create(ctx, {
      status: "active",
      community: communityId,
      user: newMember.userId,
      role: newMember.role,
    });
    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_CREATED };
  }

  static async getCommunityMemberById(ctx: Ctx, id: string, options?: ValidateCommunityMemberOptions) {
    let member = await CommunityMemberRepo.getById(ctx, id);
    if (options) member = CommunityMemberUtils.validateCommunityMember(member, options);
    return { data: member ? CommunityMemberUtils.sanitize(member) : null };
  }

  static async getCommunityMemberByUserId(
    ctx: Ctx,
    query: { communityId: string; userId: string },
    options?: ValidateCommunityMemberOptions
  ) {
    let member = await CommunityMemberRepo.getByUserId(ctx, query);
    if (options) member = CommunityMemberUtils.validateCommunityMember(member, options);
    return { data: member ? CommunityMemberUtils.sanitize(member) : null };
  }

  static async getCommunityMembers(ctx: Ctx, query: GetCommunityMembersQuery) {
    const data = await CommunityMemberRepo.getAll(ctx, query);
    return { data };
  }

  static async updateMemberRole(ctx: Ctx, memberId: string, data: CommunityRoleUpdateInput) {
    let member = await CommunityMemberRepo.getById(ctx, memberId);
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_MEMBER_NOT_FOUND);
    if (member.status !== "active") throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_NOT_ACCEPTED);
    if (member.user.id === ctx.loggedInUser?.id) throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_IS_LOGGED_IN_USER);

    member = await CommunityMemberRepo.update(ctx, memberId, { role: data.role });
    if (!member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_UPDATED);

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_UPDATED };
  }

  static async suspendMember(ctx: Ctx, memberId: string) {
    let member = await CommunityMemberRepo.getById(ctx, memberId);
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_MEMBER_NOT_FOUND);
    if (member.status !== "active") throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_NOT_ACCEPTED);
    if (member.user.id === ctx.loggedInUser?.id) throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_IS_LOGGED_IN_USER);

    member = await CommunityMemberRepo.update(ctx, memberId, { status: "suspended" });
    if (!member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_UPDATED);

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_SUSPENDED };
  }

  static async unSuspendMember(ctx: Ctx, memberId: string) {
    let member = await CommunityMemberRepo.getById(ctx, memberId);
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_MEMBER_NOT_FOUND);
    if (member.status !== "suspended") throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_SUSPENDED);
    if (member.user.id === ctx.loggedInUser?.id) throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_IS_LOGGED_IN_USER);

    member = await CommunityMemberRepo.update(ctx, memberId, { status: "active" });
    if (!member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_UPDATED);

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_NOT_SUSPENDED };
  }
}
