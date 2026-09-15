import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { MediaFileSchema } from "@/lib/file-upload";

export const CommunityVisibilitySchema = z.enum(["public", "private"]);

export const CommunitySchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string(),
  logo: MediaFileSchema,
  isSuspended: z.boolean(),
  visibility: CommunityVisibilitySchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPCommunitySchema = CommunitySchema.pick({ id: true, name: true, key: true, logo: true });

export const ISCommunitySchema = CommunitySchema.omit({ updatedAt: true });

export const CommunityInputSchema = z.object({
  name: FieldSchemas.nameSchema("name"),
  key: FieldSchemas.nameSchema("key"),
  description: FieldSchemas.textSchema("description"),
  visibility: FieldSchemas.enumSelectSchema("visibility", CommunityVisibilitySchema),
});

export const CommunityQueryResponse = z.object({
  data: z.array(IPCommunitySchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const CommunitySortKeySchema = z.enum(["name", "key", "createdAt"]);
export const CommunityQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  communityIds: FieldSchemas.dbIdsSchema("ministryIds").optional(),
  visibility: FieldSchemas.enumSelectSchema("visibility", CommunityVisibilitySchema).optional(),
  isSuspended: z.enum(["true", "false"]).optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", CommunitySortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
