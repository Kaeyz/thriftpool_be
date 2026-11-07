import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import {
  GetAllPoolInvoicesQueryInputSchema,
  PoolInvoiceParamsSchema,
  PoolInvoicesQueryInputSchema,
} from "../zod/pool-invoice.zod";
import { PoolInvoiceController } from "./pool-invoice.controller";
import { allCommunityMembers } from "@/lib/definitions/roles";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppPoolInvoiceRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/pool-invoices`;
  const communityMembers = useApiCtx({
    authenticate: true,
    requireCommunity: true,
    roleConfig: { community: allCommunityMembers },
  });

  router.get(
    `${baseRoute}/me`,
    communityMembers,
    validateHttpInput(PoolInvoicesQueryInputSchema, "query"),
    catchHttpError(PoolInvoiceController.getMyPoolInvoices)
  );

  router.get(
    baseRoute,
    communityMembers,
    validateHttpInput(GetAllPoolInvoicesQueryInputSchema, "query"),
    catchHttpError(PoolInvoiceController.getPoolInvoices)
  );

  router.get(
    `${baseRoute}/:id`,
    communityMembers,
    validateHttpInput(PoolInvoiceParamsSchema, "params"),
    catchHttpError(PoolInvoiceController.getPoolInvoice)
  );

  return router;
};
