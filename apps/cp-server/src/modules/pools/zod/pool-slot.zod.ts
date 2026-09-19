import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema, CurrencyCodeSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { PoolSchema } from "./pool.zod";
import { ISCommunityMemberSchema } from "@/modules/community-members/zod/community-member.zod";

export const PoolSlotMemberSchema = ISCommunityMemberSchema.pick({ id: true, user: true, role: true });
export const PoolSlotStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const PoolSlotSchema = z.object({
  id: z.string(),
  pool: PoolSchema,
  emailAddress: z.string(),
  member: PoolSlotMemberSchema,
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

export const PoolSlotSortKeySchema = z.enum(["name", "amount", "currency", "createdAt"]);
export const PoolQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  communityIds: FieldSchemas.dbIdsSchema("communityIds").optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", PoolSlotSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
