import type { z } from "zod";
import type {
  ISPoolInvoiceSchema,
  IPPoolInvoiceSchema,
  PoolInvoiceInputSchema,
  PoolInvoiceCreateInputSchema,
  PoolInvoiceStatusSchema,
  PoolInvoicesQueryInputSchema,
  GetAllPoolInvoicesQueryInputSchema,
} from "../zod/pool-invoice.zod";

export type ISPoolInvoice = z.infer<typeof ISPoolInvoiceSchema>;
export type IPPoolInvoice = z.infer<typeof IPPoolInvoiceSchema>;
export type PoolInvoiceInput = z.infer<typeof PoolInvoiceInputSchema>;
export type PoolInvoiceCreateInput = z.infer<typeof PoolInvoiceCreateInputSchema>;
export type PoolInvoiceStatus = z.infer<typeof PoolInvoiceStatusSchema>;
export type GetPoolInvoicesQuery = z.infer<typeof PoolInvoicesQueryInputSchema>;
export type GetAllPoolInvoicesQuery = z.infer<typeof GetAllPoolInvoicesQueryInputSchema>;
export type ValidatePoolInvoiceOptions = { notFound?: true; status?: PoolInvoiceStatus };
