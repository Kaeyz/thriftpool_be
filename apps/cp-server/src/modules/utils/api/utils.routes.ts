import { catchHttpError, validateHttpInput } from "@packages/runtime/http";
import type { NextFunction, Router, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { FileUploadInputSchema } from "../zod/utils.zod";
import { UtilsController } from "./utils.controller";
import { useApiCtx } from "@/runtime/http/config";

const multerUpload = multer({ storage: memoryStorage() });

const upload = (fieldName: string) => {
  const singleUpload = multerUpload.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    singleUpload(req, res, (err) => {
      if (err) return next(err);
      if (req.file) req.body = { ...req.body, file: req.file };
      if (req.files) req.body = { ...req.body, files: req.files };
      next();
    });
  };
};

export const webAppUtilsRouter = (rootPath: string, router: Router) => {
  const baseRoute = `${rootPath}/utils`;

  router.post(
    `${baseRoute}/upload`,
    upload("file"),
    validateHttpInput(FileUploadInputSchema, "body"),
    useApiCtx({ authenticate: true }),
    catchHttpError(UtilsController.uploadFile)
  );
  router.get(`${baseRoute}/upload`, catchHttpError(UtilsController.getUploadConfig));
  router.get(`${baseRoute}/schema`, catchHttpError(UtilsController.getApiSchema));
  router.get(`${baseRoute}/currencies`, catchHttpError(UtilsController.getCurrencies));

  return router;
};
