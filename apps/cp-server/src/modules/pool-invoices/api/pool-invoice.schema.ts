import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { PoolInvoiceApiSchema, PoolInvoicesApiQueryResponse } from "../zod/pool-invoice.zod";

export const WebAppPoolInvoiceSchemas = {
  PoolInvoices: z.toJSONSchema(HttpResponseSchema(PoolInvoicesApiQueryResponse)),
  PoolInvoice: z.toJSONSchema(HttpResponseSchema(PoolInvoiceApiSchema)),
};
