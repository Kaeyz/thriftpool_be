import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application } from "express";
import express, { json, urlencoded } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import passport from "passport";
import { corsConfig } from "./config/cors-config";
import { setupRedis } from "./lib/event";
import routes from "./routes";
import { setupActivityLogger } from "@/config/activityLogger";
import { DB } from "@/config/db";
import { passportConfig } from "@/config/passport";
import { setupSystemData } from "@/config/system-data";

export class App {
  static async boot(): Promise<Application> {
    const app = express();
    await DB.connect();
    await setupRedis();
    await setupSystemData();

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 50,
      standardHeaders: "draft-8",
    });
    app.use(cookieParser());
    app.use(limiter);
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cors(corsConfig));

    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(passport.initialize());

    passportConfig(passport);
    setupActivityLogger(app);
    routes(app);

    process.on("unhandledRejection", (reason) => {
      throw reason;
    });

    process.on("uncaughtException", (error) => {
      // eslint-disable-next-line no-console
      console.log(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
      process.kill(process.pid, "SIGTERM");
    });

    return app;
  }
}
