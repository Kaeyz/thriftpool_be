import type { Ctx } from "../ctx/ctx.types";
import { CloudinaryService } from "./cloudinary";
import type { IMediaUpload } from "./types";
import { getFileUploadConfig, validateEntityName } from "./upload-config";
import { validateUpload } from "./upload-validator";

export async function handleUpload(ctx: Ctx, fileData: IMediaUpload) {
  let response: { data?: unknown; err?: string } = {};
  try {
    const { file, entityName, useCase } = fileData;

    if (!validateEntityName(ctx, entityName)) throw new Error(`Unknown entity: ${entityName}`);

    const entityConfig = getFileUploadConfig(entityName);
    if (!entityConfig) throw new Error(`Upload Config for ${entityName} not found`);

    const useCaseConfig = entityConfig.useCases.find((u) => u.useCaseName === useCase);
    if (!useCaseConfig) throw new Error(`Unknown use case: ${useCase}`);
    validateUpload(file, useCaseConfig.config);

    if (useCaseConfig.validate) {
      const { message, status } = await useCaseConfig.validate(ctx, fileData.entityId);
      if (!status) throw new Error(message);
    }

    const uploadRes = await CloudinaryService.upload(fileData);
    if (uploadRes.status === "failed") throw new Error(`Unable to upload: ${uploadRes.data.message}`);

    const data = await useCaseConfig.resolve(ctx, fileData.entityId, uploadRes.data);

    response = { ...response, data };

    return response;
  } catch (err) {
    response = { ...response, err: (err as Error)?.message || "" };
    return response;
  }
}
