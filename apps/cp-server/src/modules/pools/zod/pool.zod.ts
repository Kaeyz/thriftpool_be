import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema, CurrencyCodeSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { IPBankAccountSchema } from "@/modules/bank-accounts/zod/bank-account.zod";
import { ISCommunitySchema } from "@/modules/communities/zod/community.zod";
import { ISCommunityMemberSchema } from "@/modules/community-members/zod/community-member.zod";

export const PoolCommunitySchema = ISCommunitySchema.pick({ id: true, name: true, logo: true });
export const MemberInPoolSchema = ISCommunityMemberSchema.pick({ id: true, user: true, role: true });
export const PoolPaymentIntervalSchema = z.enum(["monthly", "weekly"]);
export const PoolStatusSchema = z.enum(["initiated", "ongoing", "completed"]);
export const PoolPaymentModeSchema = z.enum(["direct_payment", "via_pool_account"]);
export const PoolAccountTypeSchema = z.enum(["bank_account"]);
export const PoolMemberRoleSchema = z.enum(["owner", "admin", "member"]);

export const PoolAccountInfoSchema = z.object({
  accountType: PoolAccountTypeSchema,
  bankAccount: IPBankAccountSchema,
});

export const PoolMemberSchema = z.object({
  member: MemberInPoolSchema,
  role: PoolMemberRoleSchema,
});

export const PoolSchema = z.object({
  id: z.string(),
  community: PoolCommunitySchema,
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  currencyCode: CurrencyCodeSchema,
  paymentInterval: PoolPaymentIntervalSchema,
  noOfSlots: z.number(),
  paymentMode: PoolPaymentModeSchema,
  poolAccountInfo: PoolAccountInfoSchema,
  poolMembers: z.array(PoolMemberSchema),
  status: PoolStatusSchema,
  startDate: z.number(),
  endDate: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPPoolSchema = PoolSchema.pick({ id: true, name: true, amount: true, status: true });
export const ISPoolSchema = PoolSchema.omit({ updatedAt: true });

export const PoolInputSchema = z
  .object({
    name: FieldSchemas.nameSchema("name"),
    description: FieldSchemas.nameSchema("description"),
    amount: FieldSchemas.numberSchema("amount"),
    currencyCode: CurrencyCodeSchema,
    paymentInterval: FieldSchemas.enumSelectSchema("paymentInterval", PoolPaymentIntervalSchema),
    paymentMode: FieldSchemas.enumSelectSchema("paymentMode", PoolPaymentModeSchema),
    poolAccountType: FieldSchemas.enumSelectSchema("poolAccountType", PoolAccountTypeSchema).optional(),
    poolBankAccountId: FieldSchemas.dbIdSchema("poolBankAccountId").optional(),
    noOfSlot: FieldSchemas.numberSchema("noOfSlot"),
  })
  .refine(
    (data) => {
      if (data.paymentMode !== "via_pool_account") return true;
      return data.paymentMode === "via_pool_account" && data.poolAccountType;
    },
    {
      path: ["poolAccountType"],
      message: "Pool account Type is required",
    }
  )
  .refine(
    (data) => {
      if (data.paymentMode !== "via_pool_account") return true;
      return data.paymentMode === "via_pool_account" && data.poolAccountType === "bank_account" && data.poolBankAccountId;
    },
    {
      path: ["poolBankAccountId"],
      message: "Pool Bank account is required",
    }
  );

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
  memberId: FieldSchemas.dbIdSchema("memberId").optional(),
  status: FieldSchemas.enumSelectSchema("status", PoolStatusSchema).optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", PoolSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
