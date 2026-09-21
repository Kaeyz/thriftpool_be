import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { BankAccountInputSchema } from "../zod/bank-account.zod";
import { BankAccountController } from "./bank-account.controller";
import { useApiCtx } from "@/runtime/http/config/http-context";

export const webAppBankAccountRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/bank-accounts`;

  router.put(
    `${baseRoute}/:id`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(BankAccountInputSchema, "body"),
    catchHttpError(BankAccountController.updatedBankAccount)
  );

  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(BankAccountController.getMyBankAccounts));

  router.post(
    `${baseRoute}`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(BankAccountInputSchema, "body"),
    catchHttpError(BankAccountController.createBankAccount)
  );

  return router;
};
