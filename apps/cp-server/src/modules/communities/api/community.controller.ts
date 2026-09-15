import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetCommunityQuery } from "../common/community.dto";
import { CommunityService } from "../services/community.service";

export class CommunityController {
  static async createCommunity(req: Request, res: Response) {
    const serviceResponse = await CommunityService.createCommunity(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMyMinistries(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir } = req.query as GetCommunityQuery;
    const query: GetCommunityQuery = { limit, page, sortKey, sortDir };
    const serviceResponse = await CommunityService.getMyCommunities(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateCommunity(req: Request, res: Response) {
    const communityId = req.ctx?.ministry?.id || "";
    const serviceResponse = await CommunityService.updateCommunity(req.ctx, communityId, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
