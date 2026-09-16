import type { Ctx } from "@/lib/ctx/ctx.types";

export {};

declare global {
  namespace Express {
    interface Request {
      ctx: Ctx;
    }
  }
}
