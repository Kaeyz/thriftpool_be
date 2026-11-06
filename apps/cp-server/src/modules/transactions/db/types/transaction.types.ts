import type { CurrencyCode } from "@packages/core/enums";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { TransactionSchema } from "../../zod/transaction.zod";

export type ITransaction = {
  id: string;
  invoice: string;
  fromBankAccount?: string;
  toBankAccount?: string;
  amount: number;
  currencyCode: CurrencyCode;
  status: "pending" | "completed" | "failed";
  reference?: string;
  description?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ITransactionInput = Partial<ITransaction>;
export type TransactionDoc = z.infer<typeof TransactionSchema> & Document;
