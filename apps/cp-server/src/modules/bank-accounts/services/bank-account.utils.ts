import { CurrencyCode } from "@packages/core/enums";
import { AppError, StatusCodes } from "@packages/core/res-config";
import { hashObject } from "@packages/core/token";
import type { AccountDetail, ISBankAccount } from "../common/bank-account.dto";
import { BANK_ACCOUNT_NOT_FOUND } from "../common/bank-account.res";
import type { BankAccountDoc } from "../db/bank-account.types";

export const validateBankAccountOptions = {
  notFound: true,
};

export class BankAccountUtils {
  static sanitize(bankAccount: BankAccountDoc): ISBankAccount {
    const obj = bankAccount.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISBankAccount;
  }

  static validateBankAccount(bankAccount: BankAccountDoc | null, options = validateBankAccountOptions) {
    const { notFound } = options;
    if (notFound && !bankAccount) throw new AppError(StatusCodes.NOT_FOUND, BANK_ACCOUNT_NOT_FOUND);
    return bankAccount;
  }

  static generateAccountDetailHash(account: AccountDetail) {
    let data: object = {};

    switch (account.currencyCode) {
      case CurrencyCode.EUR:
        data = { iban: account.iban, bic: account.bic };
        break;

      case CurrencyCode.NGN:
        data = { bankName: account.bankName, accountNumber: account.accountNumber };
        break;

      case CurrencyCode.GBP:
        data = { sortCode: account.sortCode, accountNumber: account.accountNumber };
        break;

      case CurrencyCode.USD:
        data = { routingNumber: account.routingNumber, accountNumber: account.accountNumber };
        break;
    }

    return hashObject(data);
  }
}
