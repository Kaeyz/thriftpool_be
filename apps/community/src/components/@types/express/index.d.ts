import type { Ctx } from "@/lib/request-context/config";

export {};

declare global {
  namespace Express {
    interface Request {
      ctx: Ctx;
    }
  }
}
