import { currencyCodes } from "@packages/core/currencies";
import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import {
  MemberInPoolSchema,
  PoolAccountTypeSchema,
  PoolCommunitySchema,
  PoolMemberRoleSchema,
  PoolPaymentIntervalSchema,
  PoolPaymentModeSchema,
  PoolStatusSchema,
} from "../../zod/pool.zod";
import type { IPool } from "../types/pool.types";
import { BANK_ACCOUNTS, COMMUNITIES, COMMUNITY_MEMBERS, POOLS } from "@/lib/definitions";
import { IPBankAccountSchema } from "@/modules/bank-accounts/zod/bank-account.zod";

const PoolSchema: Schema = new Schema(
  {
    community: { type: Schema.Types.ObjectId, ref: COMMUNITIES },
    name: String,
    description: String,
    amount: Number,
    noOfSlots: Number,
    currencyCode: { type: String, enum: currencyCodes },
    paymentInterval: { type: String, enum: PoolPaymentIntervalSchema.options },
    paymentMode: { type: String, enum: PoolPaymentModeSchema.options },
    poolAccountInfo: {
      accountType: { type: String, enum: PoolAccountTypeSchema.options },
      bankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS },
    },
    status: { type: String, enum: PoolStatusSchema.options },
    poolMembers: [
      {
        member: { type: Schema.Types.ObjectId, ref: COMMUNITY_MEMBERS },
        role: { type: String, enum: PoolMemberRoleSchema.options },
      },
    ],
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(PoolSchema);

PoolSchema.index({ name: "text", description: "text" });

PoolSchema.index({ name: 1 });
PoolSchema.index({ description: 1 });

const autoPopulate = function (this: Query<unknown, unknown>, next: () => void) {
  this.populate([{ transform, path: "community", select: parseSelectFromSchema(PoolCommunitySchema) }]);
  this.populate([{ transform, path: "poolMembers.member", select: parseSelectFromSchema(MemberInPoolSchema) }]);
  this.populate([{ transform, path: "poolAccountInfo.bankAccount", select: parseSelectFromSchema(IPBankAccountSchema) }]);
  next();
};

PoolSchema.pre("findOne", autoPopulate).pre("findOneAndUpdate", autoPopulate).pre("find", autoPopulate);

export const Pool: Model<IPool> = models[POOLS] || model<IPool>(POOLS, PoolSchema);
