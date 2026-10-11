import type { Ctx } from "../ctx/ctx.types";
import type { RequestSource } from "../definitions";
import type { EntityConfig } from "./types";
import { communityUploadConfig } from "@/modules/communities/services/community.upload-config";
import { userUploadConfig } from "@/modules/users/services/user.upload-config";

export const fileUploadConfigs: Partial<Record<string, EntityConfig<string, string, object>>> = {
  user: userUploadConfig,
  community: communityUploadConfig,
};

const sourceConfigs: Record<RequestSource, string[]> = {
  "web-app": ["user", "community"],
  system: [],
};

export const validateEntityName = (ctx: Ctx, entityName: string) => {
  return sourceConfigs[ctx.requestSource].includes(entityName);
};

export const getConfigMap = (ctx: Ctx) => {
  const obj: Record<string, EntityConfig<string, string, object>> = {};

  const allowedEntities = sourceConfigs[ctx.requestSource];

  for (const entityName of allowedEntities) {
    const config = fileUploadConfigs[entityName];

    if (config) {
      obj[entityName] = config;
    }
  }

  return obj;
};
