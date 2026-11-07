import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema, AccountTypeSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { IPPoolSchema } from "./pool.zod";
import { IPBankAccountSchema } from "@/modules/bank-accounts/zod/bank-account.zod";
import { ISCommunityMemberSchema } from "@/modules/community-members/zod/community-member.zod";

export const SlotMemberSchema = ISCommunityMemberSchema.pick({ id: true, user: true, role: true });
export const PoolSlotOwnerStatusSchema = z.enum(["draft", "pending", "approved", "rejected"]);

export const PoolSlotOwnerSchema = z.object({
  member: SlotMemberSchema,
  status: PoolSlotOwnerStatusSchema,
});

export const PoolSlotCycleStateSchema = z.enum(["pending", "active", "completed"]);
export const SlotCycleStateSchema = z.object({
  state: PoolSlotCycleStateSchema,
  startDate: z.number(),
  endDate: z.number(),
});

export const PoolSlotPaymentInfoSchema = z.object({
  accountType: AccountTypeSchema,
  bankAccount: IPBankAccountSchema,
});

export const PoolSlotSchema = z.object({
  id: z.string(),
  pool: IPPoolSchema,
  position: z.number().min(1),
  slotOwner: PoolSlotOwnerSchema,
  cycleState: SlotCycleStateSchema,
  paymentInfo: PoolSlotPaymentInfoSchema,
  plannedStartDate: z.number().optional(),
  plannedEndDate: z.number().optional(),
  startDate: z.number().optional(),
  endedDate: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPPoolSlotSchema = PoolSlotSchema.pick({ id: true, position: true, slotOwner: true, paymentInfo: true });
export const ISPoolSlotSchema = PoolSlotSchema.omit({ updatedAt: true });

export const PoolSlotInputSchema = z.object({
  memberId: FieldSchemas.dbIdSchema("memberId"),
  position: FieldSchemas.numberSchema("position"),
  accountType: AccountTypeSchema.optional(),
  bankAccountId: FieldSchemas.dbIdSchema("bankAccountId").optional(),
});

export const PoolSlotPaymentInputSchema = z.object({
  accountType: AccountTypeSchema,
  bankAccountId: FieldSchemas.dbIdSchema("bankAccountId"),
});

export const PoolIdParamsSchema = z.object({
  poolId: FieldSchemas.dbIdSchema("poolId"),
});

export const PoolSlotIdParamsSchema = z.object({
  id: FieldSchemas.dbIdSchema("poolSlotId"),
});

export const PoolSlotQueryResponse = z.object({
  data: z.array(IPPoolSlotSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const PoolSlotSortKeySchema = z.enum(["createdAt", "position"]);
export const PoolSlotQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  poolId: FieldSchemas.dbIdSchema("poolId").optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", PoolSlotSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});

export const PoolSlotsQueryInputSchema = PoolSlotQueryInputSchema.extend({
  poolId: FieldSchemas.dbIdSchema("poolId"),
});
