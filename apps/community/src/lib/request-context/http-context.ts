import { ApiError, StatusCodes } from "@packages/core/http";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { authenticateUser, extractDeviceId } from "./auth";
import { CtxError } from "./config";

type BaseContextConfig = {
  authenticate?: boolean;
  dbTransaction?: boolean;
  validateDevice?: boolean;
};

type ContextConfig = BaseContextConfig | ((req: Request) => BaseContextConfig);

export const useApiContext = (config: ContextConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resolvedConfig: BaseContextConfig = typeof config === "function" ? config(req) : config;

    try {
      const { dbTransaction, authenticate, validateDevice } = resolvedConfig;
      if (authenticate) {
        const loggedInUser = await authenticateUser(req, res);
        if (loggedInUser) req.ctx = { ...req.ctx, loggedInUser };
      }

      if (validateDevice) await extractDeviceId(req);
      if (dbTransaction) {
        const session = await mongoose.startSession();
        session.startTransaction();
        req.ctx = { ...req.ctx, session };
      }

      const resolveTransaction = async () => {
        const session = req.ctx?.session;
        if (session) {
          if (res.statusCode === 200) {
            await session.commitTransaction();
          } else {
            await session.abortTransaction();
          }
          await session.endSession();
        }
      };

      res.on("finish", () => void resolveTransaction());
      next();
    } catch (err) {
      let response: ApiError;
      response = new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
      if (err instanceof Error) response = new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
      if (err instanceof CtxError) response = new ApiError(err.statusCode, err.message, err?.data);
      return res.status(response.statusCode).json(response);
    }
  };
};
