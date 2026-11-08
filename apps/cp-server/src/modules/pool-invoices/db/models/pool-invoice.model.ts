import { addVirtualId, isPathSelected, parseSelectFromSchema, transform } from "@packages/core/database";
import { AccountTypeSchema } from "@packages/core/zod-schemas";
import type { Model } from "mongoose";
import { Schema, model, models, type Query } from "mongoose";
import { PoolInvoiceStatusSchema, PoolSlotInInvoiceSchema, SlotMemberSchema } from "../../zod/pool-invoice.zod";
import type { IPoolInvoice } from "../types/pool-invoice.types";
import { BANK_ACCOUNTS, COMMUNITY_MEMBERS, POOL_INVOICES, POOL_SLOTS, POOLS, TRANSACTIONS } from "@/lib/definitions";
import { IPBankAccountSchema } from "@/modules/bank-accounts/zod/bank-account.zod";

const PoolInvoiceSchema: Schema = new Schema(
  {
    pool: { type: Schema.Types.ObjectId, ref: POOLS, required: true },
    poolSlot: { type: Schema.Types.ObjectId, ref: POOL_SLOTS, required: true },
    sender: {
      member: { type: Schema.Types.ObjectId, ref: COMMUNITY_MEMBERS, required: true },
      accountType: { type: String, enum: AccountTypeSchema.options, required: true },
      bankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS, required: true },
    },
    receiver: {
      member: { type: Schema.Types.ObjectId, ref: COMMUNITY_MEMBERS, required: true },
      accountType: { type: String, enum: AccountTypeSchema.options, required: true },
      bankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS, required: true },
    },
    turnNumber: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    currencyCode: { type: String, required: true },
    transaction: { type: Schema.Types.ObjectId, ref: TRANSACTIONS },
    transactions: [{ type: Schema.Types.ObjectId, ref: TRANSACTIONS }],
    remittedAmount: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: PoolInvoiceStatusSchema.options, default: "pending" },
    issuedAt: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    paidAt: Date,
  },
  { timestamps: true, versionKey: false }
);

addVirtualId(PoolInvoiceSchema);
PoolInvoiceSchema.index({ poolSlot: 1, turnNumber: 1 }, { unique: true });

const autoPopulate = function (this: Query<unknown, unknown>, next: () => void) {
  const projection = this.projection();
  if (isPathSelected(projection, "poolSlot")) {
    this.populate([{ transform, path: "poolSlot", select: parseSelectFromSchema(PoolSlotInInvoiceSchema) }]);
  }
  for (const path of ["sender", "receiver"] as const) {
    if (isPathSelected(projection, path)) {
      this.populate([
        { transform, path: `${path}.member`, select: parseSelectFromSchema(SlotMemberSchema) },
        { transform, path: `${path}.bankAccount`, select: parseSelectFromSchema(IPBankAccountSchema) },
      ]);
    }
  }
  next();
};

PoolInvoiceSchema.pre("findOne", autoPopulate).pre("findOneAndUpdate", autoPopulate).pre("find", autoPopulate);

export const PoolInvoice: Model<IPoolInvoice> = models[POOL_INVOICES] || model<IPoolInvoice>(POOL_INVOICES, PoolInvoiceSchema);
