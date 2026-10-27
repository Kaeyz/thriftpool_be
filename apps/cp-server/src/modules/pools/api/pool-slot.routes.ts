import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import {
  PoolIdParamsSchema,
  PoolSlotIdParamsSchema,
  PoolSlotInputSchema,
  PoolSlotPaymentInputSchema,
  PoolSlotsQueryInputSchema,
} from "../zod/pool-slot.zod";
import { PoolSlotController } from "./pool-slot.controller";
import { allCommunityMembers, communityOwner } from "@/lib/definitions/roles";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppPoolSlotRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/pool-slots`;
  const communityMembers = useApiCtx({
    authenticate: true,
    requireCommunity: true,
    roleConfig: { community: allCommunityMembers },
  });
  const communityOwnerOnly = useApiCtx({
    authenticate: true,
    requireCommunity: true,
    roleConfig: { community: communityOwner },
  });

  router.post(
    `${rootPath}/pools/:poolId/slots`,
    communityOwnerOnly,
    validateHttpInput(PoolIdParamsSchema, "params"),
    validateHttpInput(PoolSlotInputSchema, "body"),
    catchHttpError(PoolSlotController.addNewSlot)
  );

  router.put(
    `${baseRoute}/:id/member`,
    communityOwnerOnly,
    validateHttpInput(PoolSlotIdParamsSchema, "params"),
    validateHttpInput(PoolSlotInputSchema, "body"),
    catchHttpError(PoolSlotController.updatePoolSlotMember)
  );

  router.put(
    `${baseRoute}/:id/confirm`,
    communityOwnerOnly,
    validateHttpInput(PoolSlotIdParamsSchema, "params"),
    catchHttpError(PoolSlotController.confirmPoolSlot)
  );

  router.put(
    `${baseRoute}/:id/accept`,
    communityMembers,
    validateHttpInput(PoolSlotIdParamsSchema, "params"),
    validateHttpInput(PoolSlotPaymentInputSchema, "body"),
    catchHttpError(PoolSlotController.userAcceptSlot)
  );

  router.put(
    `${baseRoute}/:id/reject`,
    communityMembers,
    validateHttpInput(PoolSlotIdParamsSchema, "params"),
    catchHttpError(PoolSlotController.userRejectSlot)
  );

  router.put(
    `${baseRoute}/:id/revoke`,
    communityOwnerOnly,
    validateHttpInput(PoolSlotIdParamsSchema, "params"),
    catchHttpError(PoolSlotController.adminRevokeSlot)
  );

  router.get(
    `${baseRoute}/:id`,
    communityMembers,
    validateHttpInput(PoolSlotIdParamsSchema, "params"),
    catchHttpError(PoolSlotController.getPoolSlot)
  );

  router.get(
    baseRoute,
    communityMembers,
    validateHttpInput(PoolSlotsQueryInputSchema, "query"),
    catchHttpError(PoolSlotController.getPoolSlots)
  );

  return router;
};
