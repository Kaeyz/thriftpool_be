import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { PoolInputSchema } from "../zod/pool.zod";
import { PoolController } from "./pool.controller";
import { allCommunityAdmin, allCommunityMembers } from "@/lib/definitions/roles";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppPoolRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/pools`;

  router.put(
    `${baseRoute}/:id`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityAdmin },
    }),
    validateHttpInput(PoolInputSchema, "body"),
    catchHttpError(PoolController.updatePool)
  );

  router.get(
    `${baseRoute}/me`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityMembers },
    }),
    catchHttpError(PoolController.getMyPools)
  );

  router.post(
    `${baseRoute}`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityAdmin },
    }),
    validateHttpInput(PoolInputSchema, "body"),
    catchHttpError(PoolController.createPool)
  );

  return router;
};
