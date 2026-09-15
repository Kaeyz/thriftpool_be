import { StatusCodes } from "@packages/core/res-config";
import type { Request, Response } from "express";
import passport from "passport";
import { CtxError } from "@/lib/ctx/ctx.types";
import { validateCommunity } from "@/modules/communities";
import type { ISUser } from "@/modules/users/common/user.dto";

export const authenticateHttp = (req: Request, res: Response): Promise<ISUser> => {
  return new Promise((resolve, reject) => {
    passport.authenticate("jwt", { session: false }, (err: string, user: ISUser) => {
      if (err) return reject(new CtxError(StatusCodes.UNAUTHENTICATED, "Authentication failed", err));
      if (!user) return reject(new CtxError(StatusCodes.UNAUTHENTICATED, "Session expired or invalid"));
      if (user.isSuspended) return reject(new CtxError(StatusCodes.UNAUTHENTICATED, "Account is suspended. Contact support"));
      req.ctx = { ...req.ctx, loggedInUser: user };
      return resolve(user);
    })(req, res);
  });
};

export const validateHttpCommunity = async (req: Request) => {
  const communityKey = req.headers["community-key"] as string | undefined;
  req.ctx = await validateCommunity(req.ctx, communityKey);
  return req.ctx;
};
