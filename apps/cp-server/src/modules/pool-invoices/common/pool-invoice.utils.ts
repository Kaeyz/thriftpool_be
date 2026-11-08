import { AppError, StatusCodes } from "@packages/core/res-config";
import type { PoolInvoiceDoc } from "../db/types/pool-invoice.types";
import type { ISPoolInvoice, ValidatePoolInvoiceOptions } from "./pool-invoice.dto";
import { POOL_INVOICE_NOT_FOUND } from "./pool-invoice.res";

export class PoolInvoiceUtils {
  static sanitize(invoice: PoolInvoiceDoc): ISPoolInvoice {
    const obj = invoice.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISPoolInvoice;
  }

  static validatePoolInvoice(invoice: PoolInvoiceDoc | null, options: ValidatePoolInvoiceOptions) {
    if (options.notFound && !invoice) throw new AppError(StatusCodes.NOT_FOUND, POOL_INVOICE_NOT_FOUND);
    if (options.status && invoice?.status !== options.status) {
      throw new AppError(StatusCodes.BAD_REQUEST, `Pool invoice must be ${options.status}`);
    }
    return invoice;
  }
}
