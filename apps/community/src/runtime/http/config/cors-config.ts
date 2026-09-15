import { getKeys } from "@/config/keys";

const prodOrigins = ["https://thriftpool.com"];

const testOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://staging-cp-api.up.railway.app",
  "https://staging-cp-fe.up.railway.app",
];

export const allowedOrigins = getKeys().appEnv === "prod" ? prodOrigins : testOrigins;
