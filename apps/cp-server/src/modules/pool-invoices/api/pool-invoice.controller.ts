import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetAllPoolInvoicesQuery, GetPoolInvoicesQuery } from "../common/pool-invoice.dto";
import { PoolInvoiceService } from "../services/pool-invoice.service";

export class PoolInvoiceController {
  static async getMyPoolInvoices(req: Request, res: Response) {
    const { page, limit, poolId, poolSlotId, status, turnNumber, sortKey, sortDir } = req.query as GetPoolInvoicesQuery;
    const query: GetPoolInvoicesQuery = { page, limit, poolId, poolSlotId, status, turnNumber, sortKey, sortDir };
    const serviceResponse = await PoolInvoiceService.getMyPoolInvoices(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getPoolInvoices(req: Request, res: Response) {
    const { page, limit, poolId, poolSlotId, status, turnNumber, sortKey, sortDir } =
      req.query as unknown as GetAllPoolInvoicesQuery;
    const query: GetAllPoolInvoicesQuery = { page, limit, poolId, poolSlotId, status, turnNumber, sortKey, sortDir };
    const serviceResponse = await PoolInvoiceService.getPoolInvoices(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getPoolInvoice(req: Request, res: Response) {
    const serviceResponse = await PoolInvoiceService.getPoolInvoice(req.ctx, req.params.id as string, { notFound: true });
    return getApiSuccessResponse(res, serviceResponse);
  }
}
