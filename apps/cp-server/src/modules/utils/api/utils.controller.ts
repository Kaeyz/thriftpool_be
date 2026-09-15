import { currencies } from "@packages/core/currencies";
import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import { UtilsService } from "../services/utils.service";
import { webAppSchemas } from "@/api-docs/config/schemas";

export class UtilsController {
  static async uploadFile(req: Request, res: Response) {
    const serviceResponse = await UtilsService.upload(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getUploadConfig(req: Request, res: Response) {
    const serviceResponse = await UtilsService.getUploadConfig(req.ctx);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getApiSchema(req: Request, res: Response) {
    const serviceResponse = { data: webAppSchemas };
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getCurrencies(_req: Request, res: Response) {
    return getApiSuccessResponse(res, { data: currencies });
  }
}
