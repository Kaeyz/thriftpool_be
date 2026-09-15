import { useApiCtx } from "@/runtime/http/config/http-context";
import { validateHttpInput } from "@/runtime/http/config/http-input-validator";
import { catchHttpError } from "@/runtime/http/config/http-res-handler";
import { Router } from "express";
import { MinistryInputSchema } from "../zod/ministry.zod";
import { MinistryController } from "./ministry.controller";

export const MP_MinistryRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/ministries`;

  router.put(
    `${baseRoute}/me`,
    useApiCtx({
      authenticate: true,
      requireMinistry: true,
      roleConfig: { ministry: ["owner"] },
    }),
    validateHttpInput(MinistryInputSchema, "body"),
    catchHttpError(MinistryController.updateMinistry)
  );

  router.get(`${baseRoute}/me`, useApiCtx({ authenticate: true }), catchHttpError(MinistryController.getMyMinistries));

  router.post(
    `${baseRoute}`,
    useApiCtx({ authenticate: true }),
    validateHttpInput(MinistryInputSchema, "body"),
    catchHttpError(MinistryController.createMinistry)
  );

  return router;
};
