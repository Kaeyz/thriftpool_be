import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { ISBankAccountSchema, BankAccountQueryResponse, BankAccountInputSchema } from "../zod/bank-account.zod";

export const WebAppBankAccountSchemas = {
  BankAccounts: z.toJSONSchema(HttpResponseSchema(BankAccountQueryResponse)),
  BankAccount: z.toJSONSchema(HttpResponseSchema(ISBankAccountSchema)),

  BankAccountInput: z.toJSONSchema(BankAccountInputSchema),
};
