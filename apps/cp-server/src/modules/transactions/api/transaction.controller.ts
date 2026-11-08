import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetMyTransactionsQuery, GetTransactionsQuery } from "../common/transaction.dto";
import { TransactionService } from "../services/transaction.service";

export class TransactionController {
  static async registerTransaction(req: Request, res: Response) {
    const serviceResponse = await TransactionService.registerTransaction(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getTransactions(req: Request, res: Response) {
    const { limit, page, invoiceId, invoiceIds, poolId, poolSlotId, status, sortKey, sortDir } =
      req.query as GetTransactionsQuery;
    const query: GetTransactionsQuery = { limit, page, invoiceId, invoiceIds, poolId, poolSlotId, status, sortKey, sortDir };
    const serviceResponse = await TransactionService.getTransactions(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMyTransactions(req: Request, res: Response) {
    const { limit, page, status, sortKey, sortDir } = req.query as GetMyTransactionsQuery;
    const query: GetMyTransactionsQuery = { limit, page, status, sortKey, sortDir };
    const serviceResponse = await TransactionService.getMyTransactions(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getTransaction(req: Request, res: Response) {
    const serviceResponse = await TransactionService.getTransactionForCurrentMember(req.ctx, req.params.id as string, {
      notFound: true,
    });
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async decideTransaction(req: Request, res: Response) {
    const serviceResponse = await TransactionService.decideTransaction(req.ctx, req.params.id as string, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
