import type { AccountType, CurrencyCode } from "@packages/core/enums";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { PoolInvoiceStatus } from "../../common/pool-invoice.dto";
import type { PoolInvoiceSchema } from "../../zod/pool-invoice.zod";

export type IPoolInvoice = {
  id: string;
  pool: string;
  poolSlot: string;
  sender: {
    member: string;
    accountType: AccountType;
    bankAccount: string;
  };
  receiver: {
    member: string;
    accountType: AccountType;
    bankAccount: string;
  };
  turnNumber: number;
  amount: number;
  currencyCode: CurrencyCode;
  transaction?: string;
  transactions?: string[];
  remittedAmount?: number;
  status: PoolInvoiceStatus;
  issuedAt: Date;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IPoolInvoiceInput = Partial<IPoolInvoice>;
export type PoolInvoiceDoc = z.infer<typeof PoolInvoiceSchema> & Document;
