import type { RequestSource } from "../definitions/types";
import type { Ctx } from "../request-context/config";
import { userUploadConfig } from "@/components/users/common/user.upload";

export const fileUploadConfigs = {
  user: userUploadConfig,
};

export type FileUploadConfigs = typeof fileUploadConfigs;
export type EntityName = keyof FileUploadConfigs;

const sourceConfigs: Record<RequestSource, EntityName[]> = {
  system: [],
  "web-app": [],
};

export const validateEntityName = (ctx: Ctx, entityName: EntityName) => {
  return sourceConfigs[ctx.requestSource].includes(entityName);
};

export const getConfigMap = (ctx: Ctx) => {
  let obj: Partial<Record<EntityName, FileUploadConfigs[EntityName]>> = {};
  const map = sourceConfigs[ctx.requestSource];

  Object.keys(fileUploadConfigs).forEach((key) => {
    const entityKey = key as EntityName;
    if (map.includes(entityKey)) {
      obj = { ...obj, [entityKey]: fileUploadConfigs[entityKey] };
    }
  });

  return obj as Record<EntityName, FileUploadConfigs[EntityName]>;
};
