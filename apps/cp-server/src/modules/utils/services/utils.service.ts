import { AppError, StatusCodes } from "@packages/core/res-config";
import type { Ctx } from "@/lib/ctx/ctx.types";
import type { IMediaUpload } from "@/lib/file-upload";
import { getConfigMap, handleUpload } from "@/lib/file-upload";

export class UtilsService {
  static async upload(ctx: Ctx, body: IMediaUpload) {
    const { data, err } = await handleUpload(ctx, body);
    if (err) throw new AppError(StatusCodes.BAD_REQUEST, err);
    return { data };
  }

  static async getUploadConfig(ctx: Ctx) {
    const config = getConfigMap(ctx);
    const useCases = Object.values(config).map((entityConfig) => ({
      entityName: entityConfig.entityName,
      useCases: entityConfig.useCases.map((u) => ({
        useCaseName: u.useCaseName,
        config: u.config,
      })),
    }));

    return { data: useCases };
  }
}
