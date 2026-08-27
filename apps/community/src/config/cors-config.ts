import type cors from "cors";
import { getKeys } from "./keys";

const prodOrigins = ["https://account.thriftpool.com"];

const testOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://dev-account-thriftpool.up.railway.app",
  "https://dev-account.thriftpool.com",
];

const allowedOrigins = getKeys().appEnv === "prod" ? prodOrigins : testOrigins;

export const corsConfig: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Error"), false);
    }
  },
  credentials: true,
};
