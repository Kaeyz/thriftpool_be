import { FieldSchemas } from "@packages/core/field-schema";
import { LimitInputSchema, PageInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { ISCommunitySchema } from "@/modules/communities/zod/community.zod";
import { ISUserSchema } from "@/modules/users/zod/user.zod";

export const UserInCommunityInviteSchema = ISUserSchema.pick({ id: true, firstName: true, lastName: true });
export const CommunityInCommunityInviteSchema = ISCommunitySchema.pick({ id: true, name: true, key: true, logo: true });

export const CommunityInviteStatusSchema = z.enum(["pending", "accepted", "rejected", "expired"]);

export const CommunityInviteSchema = z.object({
  id: z.string(),
  community: CommunityInCommunityInviteSchema,
  emailAddress: z.string(),
  user: UserInCommunityInviteSchema,
  status: CommunityInviteStatusSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPCommunityInviteSchema = CommunityInviteSchema.pick({
  id: true,
  user: true,
  emailAddress: true,
  community: true,
  status: true,
  createdAt: true,
});

export const ISCommunityInviteSchema = CommunityInviteSchema.omit({ updatedAt: true });

export const CommunityInvitesQueryResponse = z.object({
  data: z.array(IPCommunityInviteSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const CommunityInviteSortKeySchema = z.enum(["createdAt"]);
export const CommunityInvitesQueryInputSchema = z.object({
  page: PageInputSchema,
  limit: LimitInputSchema,
  status: CommunityInviteStatusSchema.optional(),
  communityId: FieldSchemas.dbIdSchema("communityId").optional(),
  userId: FieldSchemas.dbIdSchema("userId").optional(),
  emailAddress: FieldSchemas.emailSchema("emailAddress").optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", CommunityInviteSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});

export const CommunityInviteInputSchema = z.object({
  emailAddress: FieldSchemas.emailSchema("emailAddress"),
});

export const CommunityPendingInviteSchema = z.object({
  communityId: FieldSchemas.dbIdSchema("communityId"),
  inviteId: FieldSchemas.dbIdSchema("inviteId"),
  status: FieldSchemas.enumSelectSchema("status", CommunityInviteStatusSchema.extract(["accepted", "rejected"])),
});
