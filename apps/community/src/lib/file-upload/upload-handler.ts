import type { Ctx } from "../request-context/config";
import { CloudinaryService } from "./cloudinary";
import type { IMediaUpload } from "./types";
import type { EntityName } from "./upload-config";
import { fileUploadConfigs, validateEntityName } from "./upload-config";
import { validateUpload } from "./upload-validator";

export async function handleUpload(ctx: Ctx, fileData: IMediaUpload) {
  let response: { data?: unknown; err?: string } = {};
  try {
    const { file, entityName, useCase } = fileData;

    if (!validateEntityName(ctx, entityName as EntityName)) throw new Error(`Unknown entity: ${entityName}`);

    const entityConfig = fileUploadConfigs[entityName as keyof typeof fileUploadConfigs];

    const useCaseConfig = entityConfig.useCases.find((u) => u.useCaseName === useCase);
    if (!useCaseConfig) throw new Error(`Unknown use case: ${useCase}`);
    validateUpload(file, useCaseConfig.config);

    if (!useCaseConfig.validate) throw new Error("Validate func is required");

    const { message, status } = await useCaseConfig.validate(ctx, fileData.entityId);
    if (!status) throw new Error(message);

    const uploadRes = await CloudinaryService.upload(ctx, fileData);
    if (uploadRes.status === "failed") throw new Error(`Unable to upload: ${uploadRes?.data?.message}`);

    const data = await useCaseConfig.resolve(ctx, fileData.entityId, uploadRes.data);

    response = { ...response, data };

    return response;
  } catch (err) {
    if (err instanceof Error) response = { ...response, err: err?.message };
    return response;
  }
}
