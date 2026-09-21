import { Platform } from "@packages/core/enums";
import { authEmailConfig } from "./auth";
import { communityEmailConfig } from "./community";
import { userEmailConfig } from "./user";

const cpEmailConfig = {
  ...authEmailConfig,
  ...userEmailConfig,
  ...communityEmailConfig,
};

const adminEmailConfig = {
  ...authEmailConfig,
};

export const emailConfigs = {
  [Platform.Admin]: adminEmailConfig,
  [Platform.Community]: cpEmailConfig,
};
