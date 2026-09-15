import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { Router } from "express";
import { UpdateMyEmailSchema, UpdateMyPasswordSchema, UpdateMyProfileSchema } from "../zod/user.zod";
import { UserController } from "./user.controller";
import { useApiCtx } from "@/runtime/http/config";

export const webAppUserRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/users`;

  router.put(
    `${baseRoute}/verify-account`,
    useApiCtx({ authenticate: true }),
    catchHttpError(UserController.requestAccountVerification)
  );

  router.put(
    `${baseRoute}/password`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(UpdateMyPasswordSchema, "body"),
    catchHttpError(UserController.updateMyPassword)
  );

  router.put(
    `${baseRoute}/profile`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(UpdateMyProfileSchema, "body"),
    catchHttpError(UserController.updateMyProfile)
  );

  router.put(
    `${baseRoute}/email`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(UpdateMyEmailSchema, "body"),
    catchHttpError(UserController.updateMyEmail)
  );

  return router;
};
