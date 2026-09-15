import type { StatusCodesType } from "@packages/core/res-config";
import type { ClientSession } from "mongoose";
import type { RequestSource } from "../definitions";
import type { ISCommunity } from "@/modules/communities/common/community.dto";
import type { ISUser } from "@/modules/users/common/user.dto";

export type PermissionCode = string | string[];

export interface Ctx {
  requestSource: RequestSource;
  loggedInUser?: ISUser;
  session?: ClientSession;
  community?: ISCommunity;
}

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

export type AuthorizeRoleRes = { isAuthorized: boolean; err?: CtxError };
