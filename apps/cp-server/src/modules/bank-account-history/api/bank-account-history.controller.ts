import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetBankAccountHistoryQuery } from "../common/bank-account-history.dto";
import { BankAccountHistoryService } from "../services/bank-account-history.service";
import { BankAccountHistoryQueryInputSchema } from "../zod/bank-account-history.zod";

export class BankAccountHistoryController {
  static async getBankAccountHistory(req: Request, res: Response) {
    const validatedQuery = BankAccountHistoryQueryInputSchema.parse(req.query);
    const { page, limit, bankAccountId, transactionId, type, sortKey, sortDir } = validatedQuery;
    const query: GetBankAccountHistoryQuery = { page, limit, bankAccountId, transactionId, type, sortKey, sortDir };
    const serviceResponse = await BankAccountHistoryService.getBankAccountHistory(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
