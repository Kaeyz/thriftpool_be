import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import {
  TransactionDecisionInputSchema,
  MyTransactionsQueryInputSchema,
  TransactionParamsSchema,
  TransactionRegistrationInputSchema,
  TransactionsQueryInputSchema,
} from "../zod/transaction.zod";
import { TransactionController } from "./transaction.controller";
import { allCommunityMembers } from "@/lib/definitions/roles";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppTransactionRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/transactions`;
  const communityMembers = useApiCtx({
    authenticate: true,
    requireCommunity: true,
    roleConfig: { community: allCommunityMembers },
  });

  router.post(
    baseRoute,
    communityMembers,
    validateHttpInput(TransactionRegistrationInputSchema, "body"),
    catchHttpError(TransactionController.registerTransaction)
  );

  router.get(
    baseRoute,
    communityMembers,
    validateHttpInput(TransactionsQueryInputSchema, "query"),
    catchHttpError(TransactionController.getTransactions)
  );

  router.get(
    `${baseRoute}/me`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(MyTransactionsQueryInputSchema, "query"),
    catchHttpError(TransactionController.getMyTransactions)
  );

  router.get(
    `${baseRoute}/:id`,
    communityMembers,
    validateHttpInput(TransactionParamsSchema, "params"),
    catchHttpError(TransactionController.getTransaction)
  );

  router.post(
    `${baseRoute}/:id/decision`,
    useApiCtx({
      authenticate: true,
      requireCommunity: true,
      roleConfig: { community: allCommunityMembers },
      dbTransaction: true,
    }),
    validateHttpInput(TransactionParamsSchema, "params"),
    validateHttpInput(TransactionDecisionInputSchema, "body"),
    catchHttpError(TransactionController.decideTransaction)
  );

  return router;
};
