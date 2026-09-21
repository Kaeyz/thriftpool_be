import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetCommunityQuery } from "../common/pool.dto";
import { CommunityService } from "../services/pool.service";

export class CommunityController {
  static async createCommunity(req: Request, res: Response) {
    const serviceResponse = await CommunityService.createCommunity(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMyPools(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir } = req.query as GetCommunityQuery;
    const query: GetCommunityQuery = { limit, page, sortKey, sortDir };
    const serviceResponse = await CommunityService.getMyCommunities(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateCommunity(req: Request, res: Response) {
    const communityId = req.ctx?.community?.id || "";
    const serviceResponse = await CommunityService.updateCommunity(req.ctx, communityId, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
