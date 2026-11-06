import type { z } from "zod";
import type {
  BankAccountHistoryInputSchema,
  BankAccountHistoryQueryInputSchema,
  BankAccountHistoryTypeSchema,
  IPBankAccountHistorySchema,
  ISBankAccountHistorySchema,
} from "../zod/bank-account-history.zod";

export type IPBankAccountHistory = z.infer<typeof IPBankAccountHistorySchema>;
export type ISBankAccountHistory = z.infer<typeof ISBankAccountHistorySchema>;
export type BankAccountHistoryInput = z.infer<typeof BankAccountHistoryInputSchema>;
export type BankAccountHistoryType = z.infer<typeof BankAccountHistoryTypeSchema>;
export type GetBankAccountHistoryQuery = z.infer<typeof BankAccountHistoryQueryInputSchema>;
export type ValidateBankAccountHistoryOptions = { notFound?: true; type?: BankAccountHistoryType };
