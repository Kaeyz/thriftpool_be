import { AppError, StatusCodes } from "@packages/core/res-config";
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { authenticateUser } from "./auth";

type BaseContextConfig = {
  authenticate?: boolean;
  dbTransaction?: boolean;
};

type ContextConfig = BaseContextConfig | ((req: Request) => BaseContextConfig);

export const useApiContext = (config: ContextConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resolvedConfig: BaseContextConfig = typeof config === "function" ? config(req) : config;

    try {
      const { dbTransaction, authenticate } = resolvedConfig;
      if (authenticate) {
        const loggedInUser = await authenticateUser(req, res);
        if (loggedInUser) req.ctx = { ...req.ctx, loggedInUser: loggedInUser };
      }

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
      let response: AppError;
      response = new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error");
      if (err instanceof Error) response = new AppError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
      if (err instanceof AppError) response = err;
      return res.status(response.errorCode).json(response);
    }
  };
};
