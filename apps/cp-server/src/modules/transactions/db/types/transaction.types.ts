import type { CurrencyCode } from "@packages/core/enums";
import type { MediaFile } from "@packages/core/types";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { TransactionStatus } from "../../common/transaction.dto";
import type { TransactionSchema } from "../../zod/transaction.zod";

export type ITransaction = {
  id: string;
  invoice: string;
  fromBankAccount?: string;
  toBankAccount?: string;
  amount: number;
  currencyCode: CurrencyCode;
  status: TransactionStatus;
  proof?: MediaFile;
  reference?: string;
  rejectionReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ITransactionInput = Partial<ITransaction>;
export type TransactionDoc = z.infer<typeof TransactionSchema> & Document;
