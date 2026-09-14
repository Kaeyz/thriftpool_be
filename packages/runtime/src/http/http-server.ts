import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application } from "express";
import express, { json, urlencoded } from "express";
import helmet from "helmet";

type CorsConfig = {
  allowedOrigins: string[];
  allowedRegexes?: RegExp[];
};

const setupCors = (corsConfig: CorsConfig): cors.CorsOptions => {
  const { allowedOrigins, allowedRegexes } = corsConfig;
  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowedOrigin = allowedOrigins.includes(origin) || allowedRegexes?.some((regex) => regex.test(origin));
      if (isAllowedOrigin) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  };
};

type ServerConfig = {
  setupInfra: () => Promise<void>;
  cors: CorsConfig;
};

export const createHttpServer = async (config: ServerConfig): Promise<Application> => {
  await config.setupInfra();

  const app = express();

  app.use(cookieParser());
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cors(setupCors(config.cors)));

  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  process.on("uncaughtException", (error) => {
    // eslint-disable-next-line no-console
    console.log(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
    process.kill(process.pid, "SIGTERM");
  });

  return app;
};

export { Router } from "express";
