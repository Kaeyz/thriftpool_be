import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  TransactionDecisionApiInputSchema,
  TransactionRegistrationInputSchema,
  TransactionSchema,
  TransactionsQueryResponseSchema,
} from "../zod/transaction.zod";

export const WebAppTransactionSchemas = {
  Transactions: z.toJSONSchema(HttpResponseSchema(TransactionsQueryResponseSchema)),
  Transaction: z.toJSONSchema(HttpResponseSchema(TransactionSchema.omit({ updatedAt: true }))),
  TransactionRegistrationInput: z.toJSONSchema(TransactionRegistrationInputSchema),
  TransactionDecisionInput: z.toJSONSchema(TransactionDecisionApiInputSchema),
};
