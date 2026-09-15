import { FieldSchemas } from "@packages/core/field-schema";
import { LimitInputSchema, PageInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { ISCommunitySchema } from "@/modules/communities/zod/community.zod";
import { ISUserSchema } from "@/modules/users/zod/user.zod";

export const UserInCommunityMemberSchema = ISUserSchema.pick({ id: true, firstName: true, lastName: true });
export const CommunityInCommunityMemberSchema = ISCommunitySchema.pick({ id: true, name: true, key: true, logo: true });

export const CommunityMemberStatusSchema = z.enum(["pending", "accepted", "suspended", "rejected", "removed", "left"]);
export const CommunityMemberRoleSchema = z.enum(["owner", "admin", "member"]);

export const CommunityMemberSchema = z.object({
  id: z.string(),
  emailAddress: z.string(),
  community: CommunityInCommunityMemberSchema,
  user: UserInCommunityMemberSchema,
  role: CommunityMemberRoleSchema,
  status: CommunityMemberStatusSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPCommunityMemberSchema = CommunityMemberSchema.pick({
  id: true,
  user: true,
  emailAddress: true,
  role: true,
  community: true,
  status: true,
  createdAt: true,
});

export const ISCommunityMemberSchema = CommunityMemberSchema.omit({ updatedAt: true });

export const CommunityMembersQueryResponse = z.object({
  data: z.array(IPCommunityMemberSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const CommunityMemberSortKeySchema = z.enum(["createdAt"]);
export const CommunityMembersQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  role: CommunityMemberRoleSchema.optional(),
  status: CommunityMemberStatusSchema.optional(),
  communityId: FieldSchemas.dbIdSchema("communityId").optional(),
  userId: FieldSchemas.dbIdSchema("userId").optional(),
  emailAddress: FieldSchemas.emailSchema("emailAddress").optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", CommunityMemberSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});

export const CommunityMemberInputSchema = z.object({
  communityId: FieldSchemas.dbIdSchema("communityId"),
  userId: FieldSchemas.dbIdSchema("userId"),
  role: CommunityMemberRoleSchema,
});

export const InviteCommunityMemberSchema = z.object({
  emailAddress: FieldSchemas.emailSchema("emailAddress"),
});

export const CommunityPendingInviteSchema = z.object({
  communityId: FieldSchemas.dbIdSchema("communityId"),
  communityMemberId: FieldSchemas.dbIdSchema("communityMemberId"),
  status: FieldSchemas.enumSelectSchema("status", CommunityMemberStatusSchema.extract(["accepted", "rejected"])),
});

export const CommunityRoleUpdateSchema = z.object({
  role: FieldSchemas.enumSelectSchema("role", CommunityMemberRoleSchema.extract(["member", "admin"])),
});
