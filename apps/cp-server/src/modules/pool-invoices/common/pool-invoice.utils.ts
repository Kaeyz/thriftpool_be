import { AppError, StatusCodes } from "@packages/core/res-config";
import type { PoolInvoiceDoc } from "../db/types/pool-invoice.types";
import { ISPoolInvoiceSchema } from "../zod/pool-invoice.zod";
import type { ISPoolInvoice, ValidatePoolInvoiceOptions } from "./pool-invoice.dto";
import { POOL_INVOICE_NOT_FOUND } from "./pool-invoice.res";

export class PoolInvoiceUtils {
  static sanitize(invoice: PoolInvoiceDoc): ISPoolInvoice {
    return ISPoolInvoiceSchema.parse(invoice.toJSON());
  }

  static validatePoolInvoice(invoice: PoolInvoiceDoc | null, options: ValidatePoolInvoiceOptions) {
    if (options.notFound && !invoice) throw new AppError(StatusCodes.NOT_FOUND, POOL_INVOICE_NOT_FOUND);
    if (options.status && invoice?.status !== options.status) {
      throw new AppError(StatusCodes.BAD_REQUEST, `Pool invoice must be ${options.status}`);
    }
    return invoice;
  }
}
