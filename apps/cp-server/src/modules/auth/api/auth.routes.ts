import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import {
  AdminOnboardingInputSchema,
  CreateUserSchema,
  ForgotPasswordSchema,
  LoginInputSchema,
  ResetPasswordSchema,
  VerifyAccountInputSchema,
} from "../zod/auth.zod";
import { AuthController } from "./auth.controller";
import { useApiCtx } from "@/runtime/http/config";

export const webAppAuthRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/auth`;

  router.post(
    `${baseRoute}/register`,
    validateHttpInput(CreateUserSchema, "body"),
    useApiCtx({ authenticate: false }),
    catchHttpError(AuthController.registerUser)
  );

  router.post(
    `${baseRoute}/set-password`,
    validateHttpInput(ResetPasswordSchema, "body"),
    useApiCtx({ authenticate: false }),
    catchHttpError(AuthController.setPassword)
  );

  router.post(
    `${baseRoute}/verify`,
    validateHttpInput(VerifyAccountInputSchema, "body"),
    useApiCtx({ authenticate: false }),
    catchHttpError(AuthController.verifyAccount)
  );

  router.post(
    `${baseRoute}/login`,
    validateHttpInput(LoginInputSchema, "body"),
    useApiCtx({ authenticate: false }),
    catchHttpError(AuthController.loginWithPassword)
  );

  router.post(
    `${baseRoute}/forgot-password`,
    validateHttpInput(ForgotPasswordSchema, "body"),
    useApiCtx({ authenticate: false }),
    catchHttpError(AuthController.initiateForgot)
  );

  router.get(`${baseRoute}/refresh-token`, catchHttpError(AuthController.refreshAuthToken));
  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(AuthController.getLoggedInUser));

  return router;
};
