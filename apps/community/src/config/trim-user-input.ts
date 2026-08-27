import type { Request, Response, NextFunction } from "express";

export const trimUserInput = (req: Request, res: Response, next: NextFunction): void => {
  function trimStrings(obj: Record<string, unknown>): void {
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === "string") {
        obj[key] = val.trim();
      } else if (val && typeof val === "object" && !Array.isArray(val)) {
        trimStrings(val as Record<string, unknown>);
      }
    }
  }

  if (req.body && typeof req.body === "object") {
    trimStrings(req.body as Record<string, unknown>);
  }

  next();
};
