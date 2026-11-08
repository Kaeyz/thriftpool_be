import { FieldSchemas } from "@packages/core/field-schema";
import { CurrencyCodeSchema, LimitInputSchema, PageInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { MediaFileSchema } from "@/lib/file-upload/file-zod-schemas";

export const TransactionStatusSchema = z.enum([
  "pending",
  "awaiting_proof",
  "pending_approval",
  "completed",
  "rejected",
  "failed",
]);

export const TransactionDecisionSchema = z.enum(["approve", "reject"]);

export const TransactionSchema = z.object({
  id: z.string(),
  invoice: z.string(),
  fromBankAccount: z.string().optional(),
  toBankAccount: z.string().optional(),
  amount: z.number(),
  currencyCode: CurrencyCodeSchema,
  status: TransactionStatusSchema,
  proof: MediaFileSchema.optional(),
  reference: z.string().optional(),
  rejectionReason: z.string().optional(),
  completedAt: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
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
  proof: MediaFileSchema.optional(),
  reference: z.string().optional(),
  rejectionReason: z.string().optional(),
  completedAt: z.coerce.date().optional(),
});

export const TransactionParamsSchema = z.object({
  id: FieldSchemas.dbIdSchema("transactionId"),
});

export const TransactionRegistrationInputSchema = z.object({
  invoice: FieldSchemas.dbIdSchema("invoice"),
  amount: z.number().positive(),
  reference: z.string().optional(),
});

export const TransactionDecisionApiInputSchema = z.object({
  decision: TransactionDecisionSchema,
  rejectionReason: z.string().optional(),
});

export const TransactionDecisionInputSchema = TransactionDecisionApiInputSchema.extend({
  rejectionReason: z.string().trim().min(1).optional(),
}).refine((data) => data.decision !== "reject" || Boolean(data.rejectionReason), {
  path: ["rejectionReason"],
  message: "A rejection reason is required when rejecting a transaction",
});

export const TransactionsQueryResponseSchema = z.object({
  data: z.array(TransactionSchema.omit({ updatedAt: true })),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const TransactionSortKeySchema = z.enum(["createdAt", "amount", "completedAt"]);
export const MyTransactionsQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  status: TransactionStatusSchema.optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", TransactionSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});

export const TransactionsQueryInputSchema = MyTransactionsQueryInputSchema.extend({
  invoiceId: FieldSchemas.dbIdSchema("invoiceId").optional(),
  invoiceIds: FieldSchemas.dbIdsSchema("invoiceIds").optional(),
  poolId: FieldSchemas.dbIdSchema("poolId").optional(),
  poolSlotId: FieldSchemas.dbIdSchema("poolSlotId").optional(),
});
