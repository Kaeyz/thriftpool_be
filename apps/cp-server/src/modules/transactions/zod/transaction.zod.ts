import { FieldSchemas } from "@packages/core/field-schema";
import { CurrencyCodeSchema, LimitInputSchema, PageInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";

export const TransactionStatusSchema = z.enum(["pending", "completed", "failed"]);

export const TransactionSchema = z.object({
  id: z.string(),
  invoice: z.string(),
  fromBankAccount: z.string().optional(),
  toBankAccount: z.string().optional(),
  amount: z.number(),
  currencyCode: CurrencyCodeSchema,
  status: TransactionStatusSchema,
  reference: z.string().optional(),
  description: z.string().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const IPTransactionSchema = TransactionSchema.omit({ updatedAt: true });
export const ISTransactionSchema = TransactionSchema.omit({ updatedAt: true });

export const TransactionInputSchema = z.object({
  invoice: FieldSchemas.dbIdSchema("invoice"),
  fromBankAccount: FieldSchemas.dbIdSchema("fromBankAccount").optional(),
  toBankAccount: FieldSchemas.dbIdSchema("toBankAccount").optional(),
  amount: FieldSchemas.numberSchema("amount"),
  currencyCode: CurrencyCodeSchema,
  status: TransactionStatusSchema.optional(),
  reference: z.string().optional(),
  description: z.string().optional(),
  completedAt: z.coerce.date().optional(),
});

export const TransactionSortKeySchema = z.enum(["createdAt", "amount", "completedAt"]);
export const TransactionsQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  invoiceId: FieldSchemas.dbIdSchema("invoiceId").optional(),
  status: TransactionStatusSchema.optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", TransactionSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
