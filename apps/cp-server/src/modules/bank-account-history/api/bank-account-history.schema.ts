import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { BankAccountHistoriesQueryResponse, ISBankAccountHistorySchema } from "../zod/bank-account-history.zod";

export const WebAppBankAccountHistorySchemas = {
  BankAccountHistories: z.toJSONSchema(HttpResponseSchema(BankAccountHistoriesQueryResponse)),
  BankAccountHistory: z.toJSONSchema(HttpResponseSchema(ISBankAccountHistorySchema)),
};
