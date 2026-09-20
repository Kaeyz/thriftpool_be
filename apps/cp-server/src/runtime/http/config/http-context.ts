import { AppError, StatusCodes } from "@packages/core/res-config";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { authenticateHttp, validateHttpCommunity } from "./http-headers";
import type { AuthorizeRoleRes } from "@/lib/ctx/ctx.types";
import { validateCommunityRole } from "@/modules/communities";
import type { ISUser } from "@/modules/users/common/user.dto";

type BaseCtxConfig = {
  authenticate?: boolean;
  requireCommunity?: boolean;
  dbTransaction?: boolean;
  roleConfig?: { community?: string[] };
};

type CtxConfig = BaseCtxConfig | ((req: Request) => BaseCtxConfig);

export const useApiCtx = (config: CtxConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resolvedConfig: BaseCtxConfig = typeof config === "function" ? config(req) : config;

    try {
      const { dbTransaction, authenticate, requireCommunity, roleConfig } = resolvedConfig;
      let user: ISUser | null = null;
      if (authenticate) user = await authenticateHttp(req, res);

      let authorizeCommunityRes: AuthorizeRoleRes | null = null;

      if (requireCommunity) {
        await validateHttpCommunity(req);
        if (roleConfig?.community) authorizeCommunityRes = await validateCommunityRole(req.ctx, roleConfig.community);
      }

      const communityAuthorized = authorizeCommunityRes !== null && authorizeCommunityRes?.isAuthorized === true;
      if (!communityAuthorized) {
        if (roleConfig?.community && authorizeCommunityRes) throw authorizeCommunityRes?.err;
      }

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
      if (err instanceof AppError) response = err;
      return res.status(response.errorCode).json(response);
    }
  };
};
