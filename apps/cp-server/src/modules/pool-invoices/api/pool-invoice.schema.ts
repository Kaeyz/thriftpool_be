import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { ISPoolInvoiceSchema, PoolInvoicesQueryResponse } from "../zod/pool-invoice.zod";

export const WebAppPoolInvoiceSchemas = {
  PoolInvoices: z.toJSONSchema(HttpResponseSchema(PoolInvoicesQueryResponse)),
  PoolInvoice: z.toJSONSchema(HttpResponseSchema(ISPoolInvoiceSchema)),
};
