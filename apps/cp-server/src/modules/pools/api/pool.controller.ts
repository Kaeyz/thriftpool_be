import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetPoolQuery } from "../common/pool.dto";
import { PoolService } from "../services/pool.service";

export class PoolController {
  static async createPool(req: Request, res: Response) {
    const serviceResponse = await PoolService.createPool(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getPools(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir, memberId, search, status } = req.query as GetPoolQuery;
    const query: GetPoolQuery = { limit, page, sortKey, sortDir, memberId, search, status };
    const serviceResponse = await PoolService.getPools(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMyPools(req: Request, res: Response) {
    const memberId = req.ctx?.communityMember?.id;
    const { limit, page, sortKey, sortDir, search, status } = req.query as GetPoolQuery;
    const query: GetPoolQuery = { limit, page, sortKey, sortDir, memberId, search, status };
    const serviceResponse = await PoolService.getPools(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getPool(req: Request, res: Response) {
    const serviceResponse = await PoolService.getPool(req.ctx, req.params.id as string);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updatePool(req: Request, res: Response) {
    const poolId = req.params?.id as string;
    const serviceResponse = await PoolService.updatePool(req.ctx, poolId, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
