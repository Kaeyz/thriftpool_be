import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { PoolInputSchema } from "../zod/pool.zod";
import { CommunityController } from "./pool.controller";
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
    validateHttpInput(PoolInputSchema, "body"),
    catchHttpError(CommunityController.updateCommunity)
  );

  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(CommunityController.getMyPools));

  router.post(
    `${baseRoute}`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(PoolInputSchema, "body"),
    catchHttpError(CommunityController.createCommunity)
  );

  return router;
};
