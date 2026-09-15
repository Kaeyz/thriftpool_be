import { createHttpServer } from "@packages/runtime/http";
import type { Application } from "express";
import passport from "passport";
import { setupRedis } from "../event";
import { allowedOrigins } from "./config";
import routes from "./routes";
import { setupActivityLogger } from "@/config/activityLogger";
import { DB } from "@/config/db";
import { passportConfig } from "@/config/passport";
import { resolveReqSrc, setupSystemData } from "@/config/system-data";

export class App {
  static async boot(): Promise<Application> {
    const app = await createHttpServer({
      setupInfra: async () => {
        await DB.connect();
        await setupRedis();
        await setupSystemData();
      },
      cors: { allowedOrigins },
    });

    app.use(passport.initialize());
    passportConfig(passport);

    app.use(resolveReqSrc);

    setupActivityLogger(app);
    routes(app);

    return app;
  }
}
