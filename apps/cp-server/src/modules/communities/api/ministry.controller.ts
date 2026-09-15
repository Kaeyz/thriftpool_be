import { getApiSuccessResponse } from "@/runtime/http/config/http-res-handler";
import { Request, Response } from "express";
import { GetMinistriesQuery } from "../common/ministry.dto";
import { MinistryService } from "../services/ministry.service";

export class MinistryController {
  static async createMinistry(req: Request, res: Response) {
    const serviceResponse = await MinistryService.createMinistry(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMyMinistries(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir } = req.query as GetMinistriesQuery;
    const query: GetMinistriesQuery = { limit, page, sortKey, sortDir };
    const serviceResponse = await MinistryService.getMyMinistries(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateMinistry(req: Request, res: Response) {
    const ministryId = req.ctx?.ministry?.id || "";
    const serviceResponse = await MinistryService.updateMinistry(req.ctx, ministryId, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
