import type { AccountType, CurrencyCode } from "@packages/core/enums";
import type { HydratedDocument } from "mongoose";
import type { z } from "zod";
import type { PoolInvoiceStatusSchema } from "../../zod/pool-invoice.zod";

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
  status: z.infer<typeof PoolInvoiceStatusSchema>;
  issuedAt: Date;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IPoolInvoiceInput = Omit<IPoolInvoice, "id" | "createdAt" | "updatedAt" | "status"> & {
  status?: IPoolInvoice["status"];
};
export type PoolInvoiceDoc = HydratedDocument<IPoolInvoice>;
