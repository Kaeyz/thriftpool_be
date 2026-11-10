import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { PoolInputSchema, PoolParamsSchema, PoolQueryInputSchema } from "../zod/pool.zod";
import { PoolController } from "./pool.controller";
import { allCommunityAdmin, allCommunityMembers, communityOwner } from "@/lib/definitions/roles";
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

  router.post(
    `${baseRoute}/:id/start`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityAdmin },
    }),
    validateHttpInput(PoolParamsSchema, "params"),
    catchHttpError(PoolController.startPool)
  );

  router.post(
    `${baseRoute}/:id/start-next`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityAdmin },
      dbTransaction: true,
    }),
    validateHttpInput(PoolParamsSchema, "params"),
    catchHttpError(PoolController.startNextPool)
  );

  router.delete(
    `${baseRoute}/:id`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityAdmin },
    }),
    validateHttpInput(PoolParamsSchema, "params"),
    catchHttpError(PoolController.deletePool)
  );

  router.get(
    `${baseRoute}/me`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityMembers },
    }),
    validateHttpInput(PoolQueryInputSchema, "query"),
    catchHttpError(PoolController.getMyPools)
  );

  router.get(
    `${baseRoute}/:id`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityMembers },
    }),
    validateHttpInput(PoolParamsSchema, "params"),
    catchHttpError(PoolController.getPool)
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
