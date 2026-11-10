import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetBankAccountHistoryQuery } from "../common/bank-account-history.dto";
import { BankAccountHistoryService } from "../services/bank-account-history.service";

export class BankAccountHistoryController {
  static async getBankAccountHistory(req: Request, res: Response) {
    const { page, limit, bankAccountId, transactionId, type, sortKey, sortDir } =
      req.query as unknown as GetBankAccountHistoryQuery;
    const query: GetBankAccountHistoryQuery = { page, limit, bankAccountId, transactionId, type, sortKey, sortDir };
    const serviceResponse = await BankAccountHistoryService.getBankAccountHistory(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
