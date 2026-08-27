import type { StatusCodesType } from "@packages/core/http";
import type { ClientSession } from "mongoose";
import type { RequestSource } from "../definitions/types";
import type { UserAgent } from "@/lib/request-context/user-agent";
import type { ISUser } from "@/registries/dtos";

export type Ctx = {
  userAgent?: UserAgent;
  requestSource: RequestSource;
  loggedInUser?: ISUser;
  session?: ClientSession;
  deviceId?: string | null;
};

export class CtxError {
  statusCode: StatusCodesType;
  message: string;
  data: unknown;

  constructor(statusCode: StatusCodesType, message: string, data?: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
