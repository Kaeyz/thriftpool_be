import { catchApiError } from "@packages/core/http";
import { validateRequestInput } from "@packages/core/validation";
import type { Router } from "express";
import {
  ForgotInputSchema,
  LoginInputSchema,
  SessionRefreshTokenInputSchema,
  SessionTokenInputSchema,
  SetPasswordInputSchema,
  SignupInputSchema,
  VerifyTokenInputSchema,
} from "../common/auth.zod";
import { AuthController } from "./auth.controller";
import { useApiContext } from "@/lib/request-context/http-context";

export const webAppAuthRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/auth`;

  router.post(
    `${baseRoute}/set-password`,
    validateRequestInput(SetPasswordInputSchema, "body"),
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.setPassword)
  );

  router.post(
    `${baseRoute}/login`,
    validateRequestInput(LoginInputSchema, "body"),
    useApiContext({ validateDevice: true, dbTransaction: true, authenticate: false }),
    catchApiError(AuthController.loginWithPassword)
  );

  router.post(
    `${baseRoute}/verify-account`,
    validateRequestInput(VerifyTokenInputSchema, "body"),
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.verifyAccount)
  );

  router.post(
    `${baseRoute}/verify-reset-token`,
    validateRequestInput(VerifyTokenInputSchema, "body"),
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.verifyResetToken)
  );

  router.post(`${baseRoute}/signup`, validateRequestInput(SignupInputSchema, "body"), catchApiError(AuthController.signup));

  router.post(
    `${baseRoute}/forgot-password`,
    validateRequestInput(ForgotInputSchema, "body"),
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.initiateForgot)
  );

  router.get(
    `${baseRoute}/refresh-token`,
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.refreshAuthToken)
  );

  router.get(`${baseRoute}/me`, useApiContext({ authenticate: true }), catchApiError(AuthController.getLoggedInUser));

  return router;
};

export const serverApiAuthRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/auth`;

  router.post(
    `${baseRoute}/session-token`,
    validateRequestInput(SessionTokenInputSchema, "body"),
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.verifyAuthSessionToken)
  );

  router.post(
    `${baseRoute}/refresh-session-token`,
    validateRequestInput(SessionRefreshTokenInputSchema, "body"),
    useApiContext({ authenticate: false }),
    catchApiError(AuthController.verifyAuthSessionRefreshToken)
  );

  return router;
};
