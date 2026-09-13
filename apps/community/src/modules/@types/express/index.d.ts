import type { Ctx } from "@/lib/ctx/config";

export {};

declare global {
  namespace Express {
    interface Request {
      ctx: Ctx;
    }
  }
}
