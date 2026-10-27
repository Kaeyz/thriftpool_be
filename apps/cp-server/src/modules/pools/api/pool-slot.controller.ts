import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetPoolSlotQuery, PoolSlotInput, PoolSlotPaymentInput } from "../common/pool-slot.dto";
import { PoolSlotService } from "../services/pool-slot.service";

export class PoolSlotController {
  static async addNewSlot(req: Request, res: Response) {
    const poolId = req.params.poolId as string;
    const serviceResponse = await PoolSlotService.addNewSlot(req.ctx, poolId, req.body as PoolSlotInput);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getPoolSlots(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir, poolId } = req.query as GetPoolSlotQuery;
    const query: GetPoolSlotQuery = { limit, page, sortKey, sortDir, poolId };
    const serviceResponse = await PoolSlotService.getPoolSlots(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getPoolSlot(req: Request, res: Response) {
    const poolSlotId = req.params.id as string;
    const serviceResponse = await PoolSlotService.getPoolSlot(req.ctx, poolSlotId);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updatePoolSlotMember(req: Request, res: Response) {
    const poolSlotId = req.params.id as string;
    const serviceResponse = await PoolSlotService.updatePoolSlotMember(req.ctx, poolSlotId, req.body as PoolSlotInput);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async confirmPoolSlot(req: Request, res: Response) {
    const poolSlotId = req.params.id as string;
    const serviceResponse = await PoolSlotService.confirmPoolSlot(req.ctx, poolSlotId);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async userAcceptSlot(req: Request, res: Response) {
    const poolSlotId = req.params.id as string;
    const serviceResponse = await PoolSlotService.userAcceptSlot(req.ctx, poolSlotId, req.body as PoolSlotPaymentInput);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async userRejectSlot(req: Request, res: Response) {
    const poolSlotId = req.params.id as string;
    const serviceResponse = await PoolSlotService.userRejectSlot(req.ctx, poolSlotId);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async adminRevokeSlot(req: Request, res: Response) {
    const poolSlotId = req.params.id as string;
    const serviceResponse = await PoolSlotService.adminRevokeSlot(req.ctx, poolSlotId);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
