import type { Ctx } from "../ctx/ctx.types";
import type { RequestSource } from "../definitions";
import type { EntityConfig } from "./types";

const fileUploadConfigs: Partial<Record<string, EntityConfig<string, string, object>>> = {};

export const registerFileUploadConfig = (entityName: string, config: EntityConfig<string, string, object>) => {
  fileUploadConfigs[entityName] = config;
};

export const getFileUploadConfig = (entityName: string) => {
  return fileUploadConfigs[entityName];
};

const sourceConfigs: Record<RequestSource, string[]> = {
  "web-app": ["user"],
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
