import { createHttpServer } from "@packages/runtime/http";
import type { Application } from "express";
import { setupRedis } from "../event";
import { allowedOrigins } from "./config";
import routes from "./routes";
import { setupActivityLogger } from "@/config/activityLogger";
import { DB } from "@/config/db";
import { setupSystemData } from "@/config/system-data";

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

    // app.use(passport.initialize());
    // passportConfig(passport);

    setupActivityLogger(app);
    routes(app);

    return app;
  }
}
