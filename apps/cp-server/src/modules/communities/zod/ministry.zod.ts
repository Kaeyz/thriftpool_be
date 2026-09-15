import { PageInputSchema, LimitInputSchema, SortDirectionSchema } from "@/lib/definitions";
import { MediaFileSchema } from "@/lib/file-upload";
import { FieldSchemas } from "@/lib/helpers";
import * as z from "zod";

export const MinistrySchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  logo: MediaFileSchema,
  isSuspended: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPMinistrySchema = MinistrySchema.pick({ id: true, name: true, key: true, logo: true });

export const ISMinistrySchema = MinistrySchema.omit({ updatedAt: true });

export const MinistryInputSchema = z.object({
  name: FieldSchemas.nameSchema("name"),
  key: FieldSchemas.nameSchema("key"),
});

export const MinistriesQueryResponse = z.object({
  data: z.array(IPMinistrySchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const MinistrySortKeySchema = z.enum(["name", "key", "createdAt"]);
export const MinistriesQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  ministryIds: FieldSchemas.dbIdsSchema("ministryIds").optional(),
  isSuspended: z.enum(["true", "false"]).optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", MinistrySortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
