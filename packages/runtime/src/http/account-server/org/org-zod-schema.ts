import { FieldSchemas } from "@packages/core/field-schema";
import { PlatformKeySchema, PlatformSchema } from "@packages/core/zod-schemas";
import * as z from "zod";

export const OrgSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  customUrl: z.string(),
  platformKey: PlatformKeySchema,
  platform: PlatformSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const OrgInputSchema = z.object({
  platformKey: PlatformKeySchema,
  slug: FieldSchemas.nameSchema("slug").optional(),
  name: FieldSchemas.nameSchema("name"),
  customUrl: FieldSchemas.nameSchema("customUrl").optional(),
});
