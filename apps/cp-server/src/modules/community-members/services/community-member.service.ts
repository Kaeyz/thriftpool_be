import { AppError, StatusCodes } from "@packages/core/res-config";
import type {
  CommunityMemberInput,
  CommunityPendingInviteInput,
  ValidateCommunityMemberOptions,
  GetCommunityMembersQuery,
  InviteMemberInput,
  CommunityRoleUpdateInput,
} from "../common/community-member.dto";
import * as resp from "../common/community-member.res";
import { CommunityMemberUtils } from "../common/community-member.utils";
import { CommunityMemberRepo } from "../db/community-member.repo";
import type { ICommunityMemberInput } from "../db/community-member.types";
import { getKeys } from "@/config/keys";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { emailService } from "@/lib/helpers/email";
import { UserService } from "@/modules/users";

export class CommunityMemberService {
  static async createCommunityMember(ctx: Ctx, newMember: CommunityMemberInput) {
    let member = await CommunityMemberRepo.getByUserId(ctx, { communityId: newMember.communityId, userId: newMember.userId });
    if (member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_EXIST);

    await UserService.getUserById(ctx, newMember.userId, { isEmailVerified: true, isSuspended: false });

    member = await CommunityMemberRepo.create(ctx, {
      status: "accepted",
      community: newMember.communityId,
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

  static async inviteMinistryMember(ctx: Ctx, data: InviteMemberInput) {
    const communityId = ctx.community?.id || "";
    const emailAddress = data.emailAddress.toLowerCase();
    let memberExist = await CommunityMemberRepo.getByEmail(ctx, { communityId, emailAddress });

    const { data: user } = await UserService.getUserByEmail(ctx, data.emailAddress);
    if (user) {
      memberExist = await CommunityMemberRepo.getByUserId(ctx, { communityId, userId: user.id });
    }

    if (memberExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_EXIST);

    const member = await CommunityMemberRepo.create(ctx, {
      community: communityId,
      emailAddress: !user ? emailAddress : undefined,
      user: user ? user.id : undefined,
      role: "member",
      status: "pending",
    });

    await emailService.send("MembersInvite", emailAddress, {
      communityName: ctx?.community?.name || "",
      platformUrl: getKeys().webAppUrl,
    });

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_INVITED };
  }

  static async processPendingMember(ctx: Ctx, data: CommunityPendingInviteInput) {
    let member = await CommunityMemberRepo.getById(ctx, data.communityMemberId);
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_MEMBER_NOT_FOUND);
    if (member.status !== "pending") throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_PENDING);
    const { loggedInUser } = ctx;
    const isLoggedInUser = loggedInUser?.email.address === member?.emailAddress || loggedInUser?.id === member?.user?.id;

    if (!isLoggedInUser) throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_NOT_AUTHORIZED);

    const updateData: ICommunityMemberInput = {
      emailAddress: null,
      status: data.status,
    };

    if (member.emailAddress) {
      const { data: user } = await UserService.getUserByEmail(ctx, member.emailAddress, {
        isEmailVerified: true,
        isSuspended: false,
        userType: "user",
      });
      updateData.user = user?.id;
    }

    member = await CommunityMemberRepo.update(ctx, data.communityMemberId, updateData);
    if (!member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_UPDATED);

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_UPDATED };
  }

  static async updateMemberRole(ctx: Ctx, memberId: string, data: CommunityRoleUpdateInput) {
    let member = await CommunityMemberRepo.getById(ctx, memberId);
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_MEMBER_NOT_FOUND);
    if (member.status !== "accepted") throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_NOT_ACCEPTED);
    if (member.user.id === ctx.loggedInUser?.id) throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_IS_LOGGED_IN_USER);

    member = await CommunityMemberRepo.update(ctx, memberId, { role: data.role });
    if (!member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_UPDATED);

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_UPDATED };
  }

  static async suspendMember(ctx: Ctx, memberId: string) {
    let member = await CommunityMemberRepo.getById(ctx, memberId);
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_MEMBER_NOT_FOUND);
    if (member.status !== "accepted") throw new AppError(StatusCodes.BAD_REQUEST, resp.MEMBER_NOT_ACCEPTED);
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

    member = await CommunityMemberRepo.update(ctx, memberId, { status: "accepted" });
    if (!member) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_MEMBER_NOT_UPDATED);

    return { data: CommunityMemberUtils.sanitize(member), message: resp.COMMUNITY_MEMBER_NOT_SUSPENDED };
  }
}
