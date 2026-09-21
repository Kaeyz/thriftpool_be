import type { z } from "zod";
import type { AccountDetailSchema } from "../zod/account-details.zod";
import type {
  ISBankAccountSchema,
  IPBankAccountSchema,
  BankAccountSortKeySchema,
  BankAccountQueryInputSchema,
  BankAccountInputSchema,
} from "../zod/bank-account.zod";

export type AccountDetail = z.infer<typeof AccountDetailSchema>;

export type ISBankAccount = z.infer<typeof ISBankAccountSchema>;
export type IPBankAccount = z.infer<typeof IPBankAccountSchema>;

export type BankAccountSortKey = z.infer<typeof BankAccountSortKeySchema>;

export type GetBankAccountQuery = z.infer<typeof BankAccountQueryInputSchema>;
export type BankAccountInput = z.infer<typeof BankAccountInputSchema>;
