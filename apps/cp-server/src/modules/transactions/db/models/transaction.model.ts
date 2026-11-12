import { addVirtualId } from "@packages/core/database";
import { mediaFileField } from "@packages/core/db-fields";
import { CurrencyCode } from "@packages/core/enums";
import type { Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import { TransactionStatusSchema } from "../../zod/transaction.zod";
import type { ITransaction } from "../types/transaction.types";
import { BANK_ACCOUNTS, POOL_INVOICES, TRANSACTIONS } from "@/lib/definitions";

const TransactionSchema: Schema = new Schema(
  {
    ref: { type: String, required: true, immutable: true },
    invoice: { type: Schema.Types.ObjectId, ref: POOL_INVOICES, required: true },
    fromBankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS },
    toBankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS },
    amount: { type: Number, required: true, min: 0 },
    currencyCode: { type: String, enum: Object.values(CurrencyCode), required: true },
    status: { type: String, enum: TransactionStatusSchema.options, default: "pending" },
    proof: mediaFileField,
    reference: String,
    rejectionReason: String,
    completedAt: Date,
  },
  { timestamps: true, versionKey: false }
);

addVirtualId(TransactionSchema);
TransactionSchema.index({ ref: 1 }, { unique: true, sparse: true });
TransactionSchema.index({ invoice: 1 });
TransactionSchema.index({ reference: 1 }, { sparse: true });

export const Transaction: Model<ITransaction> = models[TRANSACTIONS] || model<ITransaction>(TRANSACTIONS, TransactionSchema);
