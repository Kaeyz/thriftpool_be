import type { NextFunction, Request, Response } from "express";

export const setupSystemData = async () => {
  // eslint-disable-next-line no-console
  console.log("Thriftpool is ready for business");
};

export const resolveReqSrc = (req: Request, _res: Response, next: NextFunction) => {
  if (req.path.includes("docs") || req.path.includes("socket")) {
    return next();
  }

  if (req.path.startsWith("/web-app")) {
    req.ctx = { requestSource: "web-app" };
  }

  next();
};
