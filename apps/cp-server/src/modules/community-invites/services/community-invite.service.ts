import { AppError, StatusCodes } from "@packages/core/res-config";
import type {
  CommunityInviteInput,
  CommunityPendingInviteInput,
  ValidateCommunityInviteOptions,
  GetCommunityInvitesQuery,
} from "../common/community-invite.dto";
import * as resp from "../common/community-invite.res";
import { CommunityInviteUtils } from "../common/community-invite.utils";
import { CommunityInviteRepo } from "../db/community-invite.repo";
import type { ICommunityInviteInput } from "../db/community-invite.types";
import { getKeys } from "@/config/keys";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { emailService } from "@/lib/helpers/email";
import { CommunityMemberService } from "@/modules/community-members";
import { UserService } from "@/modules/users";

export class CommunityInviteService {
  static async createNewInvite(ctx: Ctx, newInvite: CommunityInviteInput) {
    const communityId = ctx?.community?.id || "";
    let invite = await CommunityInviteRepo.getByEmail(ctx, { communityId, emailAddress: newInvite.emailAddress });
    if (invite) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_INVITE_EXIST);

    const { data: user } = await UserService.getUserByEmail(ctx, newInvite.emailAddress);

    invite = await CommunityInviteRepo.create(ctx, {
      status: "pending",
      emailAddress: newInvite.emailAddress,
      community: communityId,
      user: user ? user?.id : undefined,
    });

    await emailService.send("MembersInvite", invite.emailAddress, {
      communityName: ctx?.community?.name || "",
      platformUrl: getKeys().webAppUrl,
    });
    return { data: CommunityInviteUtils.sanitize(invite), message: resp.COMMUNITY_INVITE_CREATED };
  }

  static async getCommunityInviteById(ctx: Ctx, id: string, options?: ValidateCommunityInviteOptions) {
    let invite = await CommunityInviteRepo.getById(ctx, id);
    if (options) invite = CommunityInviteUtils.validateCommunityInvite(invite, options);
    return { data: invite ? CommunityInviteUtils.sanitize(invite) : null };
  }

  static async getCommunityInviteByUserId(
    ctx: Ctx,
    query: { communityId: string; userId: string },
    options?: ValidateCommunityInviteOptions
  ) {
    let invite = await CommunityInviteRepo.getByUserId(ctx, query);
    if (options) invite = CommunityInviteUtils.validateCommunityInvite(invite, options);
    return { data: invite ? CommunityInviteUtils.sanitize(invite) : null };
  }

  static async getCommunityInvites(ctx: Ctx, query: GetCommunityInvitesQuery) {
    const data = await CommunityInviteRepo.getAll(ctx, query);
    return { data };
  }

  static async processPendingInvite(ctx: Ctx, data: CommunityPendingInviteInput) {
    let invite = await CommunityInviteRepo.getById(ctx, data.inviteId);
    if (!invite) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_INVITE_NOT_FOUND);
    if (invite.status !== "pending") throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_INVITE_NOT_PENDING);
    const { loggedInUser } = ctx;
    const isLoggedInUser = loggedInUser?.email.address === invite?.emailAddress || loggedInUser?.id === invite?.user?.id;

    if (!isLoggedInUser) throw new AppError(StatusCodes.BAD_REQUEST, resp.INVITE_NOT_USER);

    const updateData: ICommunityInviteInput = {
      user: loggedInUser.id,
      status: data.status,
    };

    invite = await CommunityInviteRepo.update(ctx, data.inviteId, updateData);
    if (!invite) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_INVITE_NOT_UPDATED);

    if (invite.status === "accepted")
      await CommunityMemberService.createCommunityMember(ctx, {
        role: "member",
        userId: invite.user.id,
      });

    return { data: CommunityInviteUtils.sanitize(invite), message: resp.COMMUNITY_INVITE_UPDATED };
  }
}
