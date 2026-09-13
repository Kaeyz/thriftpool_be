import { AppError, StatusCodes } from "@packages/core/res-config";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { authenticateHttp } from "./http-headers";
import { CtxError, type PermissionCode } from "@/lib/ctx/ctx.types";
import type { ISUser } from "@/modules/users/common/user.dto";

type BaseCtxConfig = {
  authenticate?: boolean;
  validateShortCode?: boolean;
  routePermissions?: { admin?: PermissionCode; staff?: PermissionCode };
  dbTransaction?: boolean;
};

type CtxConfig = BaseCtxConfig | ((req: Request) => BaseCtxConfig);

export const useApiCtx = (config: CtxConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resolvedConfig: BaseCtxConfig = typeof config === "function" ? config(req) : config;

    try {
      const { validateShortCode, routePermissions, dbTransaction, authenticate } = resolvedConfig;
      let user: ISUser | null = null;
      if (authenticate) user = await authenticateHttp(req, res);

      if (dbTransaction) {
        const session = await mongoose.startSession();
        session.startTransaction();
        req.ctx = { ...req.ctx, session };
      }

      res.on("finish", () => {
        void (async () => {
          const session = req.ctx?.session;
          if (!session) return;
          res.statusCode === 200 ? await session.commitTransaction() : await session.abortTransaction();
          await session.endSession();
        })();
      });
      next();
    } catch (err) {
      let response: AppError;
      response = new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
      if (err instanceof Error) response = new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
      if (err instanceof CtxError) response = new AppError(err.statusCode, err.message, err?.data);
      return res.status(response.errorCode).json(response);
    }
  };
};
