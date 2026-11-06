import type { z } from "zod";
import type {
  IPTransactionSchema,
  ISTransactionSchema,
  TransactionInputSchema,
  TransactionStatusSchema,
  TransactionsQueryInputSchema,
} from "../zod/transaction.zod";

export type IPTransaction = z.infer<typeof IPTransactionSchema>;
export type ISTransaction = z.infer<typeof ISTransactionSchema>;
export type TransactionInput = z.infer<typeof TransactionInputSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type GetTransactionsQuery = z.infer<typeof TransactionsQueryInputSchema>;
export type ValidateTransactionOptions = { notFound?: true; status?: TransactionStatus };
