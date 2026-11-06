import { addVirtualId } from "@packages/core/database";
import { CurrencyCode } from "@packages/core/enums";
import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import { BankAccountHistoryTypeSchema } from "../../zod/bank-account-history.zod";
import type { IBankAccountHistory } from "../types/bank-account-history.types";
import { BANK_ACCOUNT_HISTORIES, BANK_ACCOUNTS, TRANSACTIONS } from "@/lib/definitions";

const BankAccountHistorySchema: Schema = new Schema(
  {
    bankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS, required: true },
    transaction: { type: Schema.Types.ObjectId, ref: TRANSACTIONS, required: true },
    type: { type: String, enum: BankAccountHistoryTypeSchema.options, required: true },
    amount: { type: Number, required: true, min: 0 },
    currencyCode: { type: String, enum: Object.values(CurrencyCode), required: true },
    description: String,
    occurredAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

addVirtualId(BankAccountHistorySchema);
BankAccountHistorySchema.index({ bankAccount: 1, occurredAt: -1 });
BankAccountHistorySchema.index({ transaction: 1, bankAccount: 1, type: 1 }, { unique: true });

export const BankAccountHistory: Model<IBankAccountHistory> =
  models[BANK_ACCOUNT_HISTORIES] || model<IBankAccountHistory>(BANK_ACCOUNT_HISTORIES, BankAccountHistorySchema);
