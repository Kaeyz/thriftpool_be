import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import {
  InviteCommunityMemberSchema,
  CommunityPendingInviteSchema,
  CommunityRoleUpdateSchema,
} from "../zod/community-member.zod";
import { CommunityMemberController } from "./community-member.controller";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppCommunityMemberRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/community-members`;

  router.put(
    `${baseRoute}/:memberId/set-role`,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner"] } }),
    validateHttpInput(CommunityRoleUpdateSchema, "body"),
    catchHttpError(CommunityMemberController.updateMemberRole)
  );

  router.put(
    `${baseRoute}/:memberId/unsuspend`,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner"] } }),
    catchHttpError(CommunityMemberController.unSuspendMember)
  );

  router.put(
    `${baseRoute}/:memberId/suspend`,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner"] } }),
    catchHttpError(CommunityMemberController.suspendMember)
  );

  router.put(
    `${baseRoute}/pending-decision`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(CommunityPendingInviteSchema, "body"),
    catchHttpError(CommunityMemberController.processPendingMember)
  );

  router.post(
    `${baseRoute}/send-invite`,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner", "admin"] } }),
    validateHttpInput(InviteCommunityMemberSchema, "body"),
    catchHttpError(CommunityMemberController.sendMembersInvite)
  );

  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(CommunityMemberController.getMyMemberShips));

  router.get(
    baseRoute,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner", "admin", "member"] } }),
    catchHttpError(CommunityMemberController.getMembers)
  );

  return router;
};
