import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { PoolPaymentModeSchema, PoolSchema } from "./pool.zod";
import { ISCommunityMemberSchema } from "@/modules/community-members/zod/community-member.zod";

export const SlotMemberSchema = ISCommunityMemberSchema.pick({ id: true, user: true, role: true });
export const PoolSlotMemberStatusSchema = z.enum(["pending", "approved", "rejected"]);
const PoolSlotCycleStateSchema = z.enum(["pending", "active", "completed"]);

const PoolSlotMemberSchema = z.object({
  member: SlotMemberSchema,
  status: PoolSlotMemberStatusSchema,
});

const SlotCycleStateSchema = z.object({
  state: PoolSlotCycleStateSchema,
  startDate: z.number(),
  endDate: z.number(),
});

const SlotPaymentInfoSchema = z.object({
  paymentMode: PoolPaymentModeSchema,
});

export const PoolSlotSchema = z.object({
  id: z.string(),
  pool: PoolSchema,
  slotOwner: PoolSlotMemberSchema,
  cycleState: SlotCycleStateSchema,
  paymentInfo: SlotPaymentInfoSchema,
  order: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPPoolSlotSchema = PoolSlotSchema.pick({ id: true, order: true });
export const ISPoolSlotSchema = PoolSlotSchema.omit({ updatedAt: true });

export const PoolSlotInputSchema = z.object({
  memberId: FieldSchemas.nameSchema("name"),
  noOfSlot: FieldSchemas.numberSchema("noOfSlot"),
});

export const PoolSlotQueryResponse = z.object({
  data: z.array(IPPoolSlotSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const PoolSlotSortKeySchema = z.enum(["createdAt"]);
export const PoolSlotQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  poolId: FieldSchemas.dbIdSchema("poolId").optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", PoolSlotSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
