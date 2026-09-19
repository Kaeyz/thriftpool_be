import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { CommunityRoleUpdateSchema } from "../zod/community-member.zod";
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

  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(CommunityMemberController.getMyMemberShips));

  router.get(
    baseRoute,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner", "admin", "member"] } }),
    catchHttpError(CommunityMemberController.getMembers)
  );

  return router;
};
