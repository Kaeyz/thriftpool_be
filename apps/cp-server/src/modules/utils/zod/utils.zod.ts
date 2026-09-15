import { FieldSchemas } from "@packages/core/field-schema";
import * as z from "zod";

export const FileUploadInputSchema = z.object({
  entityName: FieldSchemas.textSchema("entityName"),
  useCase: FieldSchemas.textSchema("useCase"),
  entityId: FieldSchemas.textSchema("entityId"),
  file: FieldSchemas.fileSchema("file"),
});
