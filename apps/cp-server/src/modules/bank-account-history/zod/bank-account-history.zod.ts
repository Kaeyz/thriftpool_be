import { FieldSchemas } from "@packages/core/field-schema";
import { CurrencyCodeSchema, LimitInputSchema, PageInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";

export const BankAccountHistoryTypeSchema = z.enum(["inflow", "outflow"]);

export const BankAccountHistorySchema = z.object({
  id: z.string(),
  bankAccount: z.string(),
  transaction: z.string(),
  type: BankAccountHistoryTypeSchema,
  amount: z.number(),
  currencyCode: CurrencyCodeSchema,
  description: z.string().optional(),
  occurredAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const IPBankAccountHistorySchema = BankAccountHistorySchema.omit({ updatedAt: true });
export const ISBankAccountHistorySchema = BankAccountHistorySchema.omit({ updatedAt: true });

export const BankAccountHistoryInputSchema = z.object({
  bankAccount: FieldSchemas.dbIdSchema("bankAccount"),
  transaction: FieldSchemas.dbIdSchema("transaction"),
  type: BankAccountHistoryTypeSchema,
  amount: FieldSchemas.numberSchema("amount"),
  currencyCode: CurrencyCodeSchema,
  description: z.string().optional(),
  occurredAt: z.coerce.date(),
});

export const BankAccountHistorySortKeySchema = z.enum(["createdAt", "occurredAt", "amount"]);
export const BankAccountHistoryQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  bankAccountId: FieldSchemas.dbIdSchema("bankAccountId").optional(),
  transactionId: FieldSchemas.dbIdSchema("transactionId").optional(),
  type: BankAccountHistoryTypeSchema.optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", BankAccountHistorySortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
