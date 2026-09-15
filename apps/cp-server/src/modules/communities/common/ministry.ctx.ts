import { StatusCodes } from "@/config/response-config";
import { Ctx, CtxError, AuthorizeRoleRes } from "@/lib/ctx";
import { MinistryService } from "@/modules/ministries";
import { MinistryMemberService } from "@/modules/ministry-members";

export const validateMinistry = async (ctx: Ctx, ministryKey?: string) => {
  if (!ministryKey) throw new CtxError(StatusCodes.INVALID_INPUT, "MinistryKey is required in header");
  const { data: ministry } = await MinistryService.getMinistryByKey(ctx, ministryKey);
  if (!ministry) throw new CtxError(StatusCodes.INVALID_INPUT, "Invalid Ministry key");

  ctx.ministry = ministry;
  return ctx;
};

export const validateMinistryRole = async (ctx: Ctx, roles: string[]) => {
  const ministry = ctx.ministry;
  let res: AuthorizeRoleRes = { isAuthorized: true };
  if (!ministry) throw new CtxError(StatusCodes.INVALID_INPUT, "Invalid Ministry key");
  const { data: member } = await MinistryMemberService.getMinistryMemberByUserId(ctx, {
    ministryId: ministry.id,
    userId: ctx?.loggedInUser?.id || "",
  });

  if (!member) {
    const err = new CtxError(StatusCodes.UNAUTHORIZED, "User not a member of ministry");
    res = { isAuthorized: false, err };
  }
  if (member && !roles.includes(member.role)) {
    const err = new CtxError(StatusCodes.UNAUTHORIZED, "User not authorized for operation");
    res = { isAuthorized: false, err };
  }
  return res;
};
