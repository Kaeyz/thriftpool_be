import { HttpResponseSchema } from "@packages/core/validation";
import { CurrenciesSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { FileUploadInputSchema } from "../zod/utils.zod";

export const WebAppUtilsSchemas = {
  FileUploadInput: z.toJSONSchema(FileUploadInputSchema),
  Currencies: z.toJSONSchema(HttpResponseSchema(CurrenciesSchema)),
};
