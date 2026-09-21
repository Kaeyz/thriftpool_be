import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetBankAccountQuery } from "../common/bank-account.dto";
import { BankAccountService } from "../services/bank-account.service";

export class BankAccountController {
  static async createBankAccount(req: Request, res: Response) {
    const serviceResponse = await BankAccountService.createBankAccount(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMyBankAccounts(req: Request, res: Response) {
    const userId = req.ctx?.loggedInUser?.id || "";
    const { limit, page, sortKey, sortDir, currencyCode } = req.query as GetBankAccountQuery;
    const query: GetBankAccountQuery = { limit, page, sortKey, sortDir, currencyCode, userId };
    const serviceResponse = await BankAccountService.getBankAccounts(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updatedBankAccount(req: Request, res: Response) {
    const bankAccountId = req.params.id as string;
    const serviceResponse = await BankAccountService.updateBankAccount(req.ctx, bankAccountId, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
