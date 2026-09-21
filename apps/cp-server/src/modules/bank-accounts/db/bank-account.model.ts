import { addVirtualId } from "@packages/core/database";
import type { Model } from "mongoose";
import { Schema, models, model } from "mongoose";
import type { IBankAccount } from "./bank-account.types";
import { BANK_ACCOUNTS, USERS } from "@/lib/definitions";

const BankAccountSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: USERS },
    accountDetail: { type: Schema.Types.Mixed },
    accountHash: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(BankAccountSchema);

BankAccountSchema.index({ "accountDetail.accountNumber": "text" });
BankAccountSchema.index({ "accountDetail.accountNumber": 1 });

export const BankAccount: Model<IBankAccount> = models[BANK_ACCOUNTS] || model<IBankAccount>(BANK_ACCOUNTS, BankAccountSchema);
