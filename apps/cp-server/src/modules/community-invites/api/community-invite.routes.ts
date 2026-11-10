import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import {
  CommunityInviteInputSchema,
  CommunityInvitesQueryInputSchema,
  CommunityPendingInviteSchema,
} from "../zod/community-invite.zod";
import { CommunityInviteController } from "./community-invite.controller";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppCommunityInviteRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/community-invites`;

  router.put(
    `${baseRoute}/pending-decision`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(CommunityPendingInviteSchema, "body"),
    catchHttpError(CommunityInviteController.processPendingInvite)
  );

  router.post(
    baseRoute,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner", "admin"] } }),
    validateHttpInput(CommunityInviteInputSchema, "body"),
    catchHttpError(CommunityInviteController.sendNewInvite)
  );

  router.get(
    `${baseRoute}/me`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(CommunityInvitesQueryInputSchema, "query"),
    catchHttpError(CommunityInviteController.getMyInvites)
  );

  router.get(
    baseRoute,
    useApiCtx({ authenticate: true, requireCommunity: true, roleConfig: { community: ["owner", "admin"] } }),
    validateHttpInput(CommunityInvitesQueryInputSchema, "query"),
    catchHttpError(CommunityInviteController.getInvites)
  );

  return router;
};
