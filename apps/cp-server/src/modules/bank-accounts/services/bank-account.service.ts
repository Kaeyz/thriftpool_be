import { AppError, StatusCodes } from "@packages/core/res-config";
import type { BankAccountInput, GetBankAccountQuery } from "../common/bank-account.dto";
import * as resp from "../common/bank-account.res";
import { BankAccountRepo } from "../db/bank-account.repo";
import { validateBankAccountOptions, BankAccountUtils } from "./bank-account.utils";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class BankAccountService {
  static async createBankAccount(ctx: Ctx, newAccount: BankAccountInput) {
    const userId = ctx?.loggedInUser?.id || "";

    const accountHash = BankAccountUtils.generateAccountDetailHash(newAccount.accountDetail);
    const bankAccountExist = await BankAccountRepo.getAccountByAccountAsh(ctx, accountHash);
    if (bankAccountExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_EXIST);

    const bankAccount = await BankAccountRepo.create(ctx, {
      user: userId,
      accountDetail: newAccount.accountDetail,
      accountHash,
    });

    return { data: BankAccountUtils.sanitize(bankAccount), message: resp.BANK_ACCOUNT_CREATED };
  }

  static async getBankAccount(ctx: Ctx, id: string, options?: typeof validateBankAccountOptions) {
    const bankAccount = await BankAccountRepo.getById(ctx, id);
    if (options) BankAccountUtils.validateBankAccount(bankAccount, options);
    return { data: bankAccount ? BankAccountUtils.sanitize(bankAccount) : null };
  }

  static async getBankAccounts(ctx: Ctx, query: GetBankAccountQuery) {
    const data = await BankAccountRepo.getAll(ctx, query);
    return { data: data };
  }

  static async updateBankAccount(ctx: Ctx, id: string, updateData: BankAccountInput) {
    let bankAccount = await BankAccountRepo.getById(ctx, id);
    BankAccountUtils.validateBankAccount(bankAccount, validateBankAccountOptions);

    const updateHash = BankAccountUtils.generateAccountDetailHash(updateData.accountDetail);
    if (updateHash !== bankAccount?.accountHash) {
      const accountExist = await BankAccountRepo.getAccountByAccountAsh(ctx, updateHash);
      if (accountExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_EXIST);
    }

    bankAccount = await BankAccountRepo.update(ctx, id, {
      accountDetail: updateData.accountDetail,
      accountHash: updateHash,
    });

    if (!bankAccount) throw new AppError(StatusCodes.BAD_REQUEST, resp.BANK_ACCOUNT_NOT_UPDATED);
    return { data: BankAccountUtils.sanitize(bankAccount), message: resp.BANK_ACCOUNT_UPDATED };
  }
}
