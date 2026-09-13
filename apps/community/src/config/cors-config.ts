import { getKeys } from "./keys";

const prodOrigins = ["https://account.thriftpool.com"];

const testOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://dev-account-thriftpool.up.railway.app",
  "https://dev-account.thriftpool.com",
];

export const allowedOrigins = getKeys().appEnv === "prod" ? prodOrigins : testOrigins;
