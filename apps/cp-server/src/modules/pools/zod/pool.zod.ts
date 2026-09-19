import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema, CurrencyCodeSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { ISCommunitySchema } from "@/modules/communities/zod/community.zod";
import { ISCommunityMemberSchema } from "@/modules/community-members/zod/community-member.zod";

export const PoolCommunitySchema = ISCommunitySchema.pick({ id: true, name: true, logo: true });
export const PoolAdminSchema = ISCommunityMemberSchema.pick({ id: true, user: true, role: true });
export const PoolPaymentIntervalSchema = z.enum(["monthly", "weekly"]);
export const PoolStatusSchema = z.enum(["initiated", "ongoing", "completed"]);
export const PoolPaymentModeSchema = z.enum(["platform_wallet", "external_account"]);

export const PoolSchema = z.object({
  id: z.string(),
  community: PoolCommunitySchema,
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  currency: CurrencyCodeSchema,
  paymentInterval: PoolPaymentIntervalSchema,
  paymentMode: PoolPaymentModeSchema,
  noOfSlots: z.number(),
  admins: z.array(PoolAdminSchema),
  status: PoolStatusSchema,
  startDate: z.number(),
  endDate: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPPoolSchema = PoolSchema.pick({ id: true, name: true, amount: true });
export const ISPoolSchema = PoolSchema.omit({ updatedAt: true });

export const PoolInputSchema = z.object({
  name: FieldSchemas.nameSchema("name"),
  description: FieldSchemas.nameSchema("description"),
  amount: FieldSchemas.numberSchema("amount"),
  currency: CurrencyCodeSchema,
  paymentInterval: FieldSchemas.enumSelectSchema("paymentInterval", PoolPaymentIntervalSchema),
  paymentMode: FieldSchemas.enumSelectSchema("paymentMode", PoolPaymentModeSchema),
  noOfSlot: FieldSchemas.numberSchema("noOfSlot"),
});

export const PoolQueryResponse = z.object({
  data: z.array(IPPoolSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const PoolSortKeySchema = z.enum(["name", "amount", "currency", "createdAt"]);
export const PoolQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  communityIds: FieldSchemas.dbIdsSchema("communityIds").optional(),
  paymentInterval: FieldSchemas.enumSelectSchema("paymentInterval", PoolPaymentIntervalSchema).optional(),
  paymentMode: FieldSchemas.enumSelectSchema("paymentMode", PoolPaymentModeSchema).optional(),
  status: FieldSchemas.enumSelectSchema("status", PoolStatusSchema).optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", PoolSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
