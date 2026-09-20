import { AppError, StatusCodes } from "@packages/core/res-config";
import type { AuthorizeRoleRes, Ctx } from "@/lib/ctx/ctx.types";
import { CommunityService } from "@/modules/communities";
import { CommunityMemberService } from "@/modules/community-members";

export const validateCommunity = async (ctx: Ctx, communityKey?: string) => {
  if (!communityKey) throw new AppError(StatusCodes.INVALID_INPUT, "Community Key is required in header");
  const { data: community } = await CommunityService.getCommunityByKey(ctx, communityKey);
  if (!community) throw new AppError(StatusCodes.INVALID_INPUT, "Invalid Community key");

  ctx.community = community;
  return ctx;
};

export const validateCommunityRole = async (ctx: Ctx, roles: string[]) => {
  const community = ctx.community;
  let res: AuthorizeRoleRes = { isAuthorized: true };
  if (!community) throw new AppError(StatusCodes.INVALID_INPUT, "Invalid Community key");
  const { data: member } = await CommunityMemberService.getCommunityMemberByUserId(ctx, {
    communityId: community.id,
    userId: ctx?.loggedInUser?.id || "",
  });

  if (!member) {
    const err = new AppError(StatusCodes.UNAUTHORIZED, "User not a member of community");
    res = { isAuthorized: false, err };
  }
  if (member && !roles.includes(member.role)) {
    const err = new AppError(StatusCodes.UNAUTHORIZED, "User not authorized for operation");
    res = { isAuthorized: false, err };
  }
  return res;
};
