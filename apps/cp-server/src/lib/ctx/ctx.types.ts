import type { AppError } from "@packages/core/res-config";
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

export type AuthorizeRoleRes = { isAuthorized: boolean; err?: AppError };
