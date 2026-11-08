import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { BankAccountHistoryQueryInputSchema } from "../zod/bank-account-history.zod";
import { BankAccountHistoryController } from "./bank-account-history.controller";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppBankAccountHistoryRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/bank-account-histories`;

  router.get(
    baseRoute,
    useApiCtx({ authenticate: true }),
    validateHttpInput(BankAccountHistoryQueryInputSchema, "query"),
    catchHttpError(BankAccountHistoryController.getBankAccountHistory)
  );

  return router;
};
