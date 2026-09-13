import { StatusCodes } from "@packages/core/res-config";
import type { Request, Response } from "express";
import passport from "passport";
import { CtxError } from "./ctx.types";

type ISUser = {
  isSuspended: boolean;
};

export const authenticateUser = (req: Request, res: Response): Promise<ISUser> => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err: string, user: ISUser) => {
      if (err) return reject(new CtxError(StatusCodes.UNAUTHENTICATED, "Authentication failed", err));
      if (!user) return reject(new CtxError(StatusCodes.UNAUTHENTICATED, "Session expired or invalid"));
      if (user.isSuspended) return reject(new CtxError(StatusCodes.UNAUTHENTICATED, "Account is suspended. Contact support"));
      return resolve(user);
    })(req, res);
  });
};
