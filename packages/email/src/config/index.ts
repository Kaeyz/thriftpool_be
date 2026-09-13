import { Platform } from "@packages/core/types";
import { authEmailConfig } from "./auth";
import { userEmailConfig } from "./user";

const communityEmailConfig = {
  ...authEmailConfig,
  ...userEmailConfig,
};

const adminEmailConfig = {
  ...authEmailConfig,
};

export const emailConfigs = {
  [Platform.Admin]: adminEmailConfig,
  [Platform.Community]: communityEmailConfig,
}