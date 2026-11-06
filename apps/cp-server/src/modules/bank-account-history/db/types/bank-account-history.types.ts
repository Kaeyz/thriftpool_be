import type { CurrencyCode } from "@packages/core/enums";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { BankAccountHistorySchema } from "../../zod/bank-account-history.zod";

export type IBankAccountHistory = {
  id: string;
  bankAccount: string;
  transaction: string;
  type: "inflow" | "outflow";
  amount: number;
  currencyCode: CurrencyCode;
  description?: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IBankAccountHistoryInput = Partial<IBankAccountHistory>;
export type BankAccountHistoryDoc = z.infer<typeof BankAccountHistorySchema> & Document;
