import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import { BankAccountHistoryService } from "../services/bank-account-history.service";
import { BankAccountHistoryQueryInputSchema } from "../zod/bank-account-history.zod";

export class BankAccountHistoryController {
  static async getBankAccountHistory(req: Request, res: Response) {
    const serviceResponse = await BankAccountHistoryService.getBankAccountHistory(
      req.ctx,
      BankAccountHistoryQueryInputSchema.parse(req.query)
    );
    return getApiSuccessResponse(res, serviceResponse);
  }
}
