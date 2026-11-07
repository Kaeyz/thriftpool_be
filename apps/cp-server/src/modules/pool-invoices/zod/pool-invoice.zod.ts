import { FieldSchemas } from "@packages/core/field-schema";
import {
  CurrencyCodeSchema,
  LimitInputSchema,
  PageInputSchema,
  SortDirectionSchema,
  AccountTypeSchema,
} from "@packages/core/zod-schemas";
import * as z from "zod";
import { IPBankAccountSchema } from "@/modules/bank-accounts/zod/bank-account.zod";
import { ISCommunityMemberSchema } from "@/modules/community-members/zod/community-member.zod";
import { ISPoolSlotSchema } from "@/modules/pools/zod/pool-slot.zod";

export const SlotMemberSchema = ISCommunityMemberSchema.pick({ id: true, user: true, role: true });
export const PoolInvoiceStatusSchema = z.enum(["pending", "paid", "cancelled"]);
export const PoolSlotInInvoiceSchema = ISPoolSlotSchema;
export const PoolInvoiceAccountInfoSchema = z.object({
  member: SlotMemberSchema,
  accountType: AccountTypeSchema,
  bankAccount: IPBankAccountSchema,
});

export const PoolInvoiceSchema = z.object({
  id: z.string(),
  pool: z.string(),
  poolSlot: PoolSlotInInvoiceSchema,
  sender: PoolInvoiceAccountInfoSchema,
  receiver: PoolInvoiceAccountInfoSchema,
  amount: z.number(),
  currencyCode: CurrencyCodeSchema,
  transaction: z.string().optional(),
  status: PoolInvoiceStatusSchema,
  dueDate: z.date(),
  paidAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const IPPoolInvoiceSchema = PoolInvoiceSchema.omit({ updatedAt: true });
export const ISPoolInvoiceSchema = PoolInvoiceSchema.omit({ updatedAt: true });
export const PoolInvoiceApiSchema = ISPoolInvoiceSchema.extend({
  dueDate: z.iso.datetime(),
  paidAt: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
});

export const PoolInvoiceInputSchema = z.object({
  pool: FieldSchemas.dbIdSchema("pool"),
  poolSlot: FieldSchemas.dbIdSchema("poolSlot"),
  turnNumber: FieldSchemas.numberSchema("turnNumber"),
  amount: FieldSchemas.numberSchema("amount"),
  currencyCode: CurrencyCodeSchema,
  status: PoolInvoiceStatusSchema.optional(),
  issuedAt: z.coerce.date(),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().optional(),
  transaction: FieldSchemas.dbIdSchema("transaction").optional(),
});

export const PoolInvoiceParamsSchema = z.object({
  id: FieldSchemas.dbIdSchema("invoiceId"),
});

export const PoolInvoiceCreateInputSchema = PoolInvoiceInputSchema.extend({
  sender: z.object({
    member: FieldSchemas.dbIdSchema("sender.member"),
    accountType: AccountTypeSchema,
    bankAccount: FieldSchemas.dbIdSchema("sender.bankAccount"),
  }),
  receiver: z.object({
    member: FieldSchemas.dbIdSchema("receiver.member"),
    accountType: AccountTypeSchema,
    bankAccount: FieldSchemas.dbIdSchema("receiver.bankAccount"),
  }),
});

export const PoolInvoiceSortKeySchema = z.enum(["createdAt", "dueDate", "issuedAt"]);
export const PoolInvoicesQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  poolId: FieldSchemas.dbIdSchema("poolId").optional(),
  poolIds: FieldSchemas.dbIdsSchema("poolIds").optional(),
  poolSlotId: FieldSchemas.dbIdSchema("poolSlotId").optional(),
  memberId: FieldSchemas.dbIdSchema("memberId").optional(),
  status: PoolInvoiceStatusSchema.optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", PoolInvoiceSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});

export const GetAllPoolInvoicesQueryInputSchema = PoolInvoicesQueryInputSchema.extend({
  poolId: FieldSchemas.dbIdSchema("poolId"),
  poolSlotId: FieldSchemas.dbIdSchema("poolSlotId"),
});

export const PoolInvoicesQueryResponse = z.object({
  data: z.array(IPPoolInvoiceSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const PoolInvoicesApiQueryResponse = z.object({
  data: z.array(PoolInvoiceApiSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});
