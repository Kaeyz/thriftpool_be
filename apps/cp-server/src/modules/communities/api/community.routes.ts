import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { CommunityInputSchema } from "../zod/community.zod";
import { CommunityController } from "./community.controller";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppCommunityRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/communities`;

  router.put(
    `${baseRoute}/me`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: ["owner"] },
    }),
    validateHttpInput(CommunityInputSchema, "body"),
    catchHttpError(CommunityController.updateCommunity)
  );

  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(CommunityController.getMyCommunities));

  router.post(
    `${baseRoute}`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(CommunityInputSchema, "body"),
    catchHttpError(CommunityController.createCommunity)
  );

  return router;
};
