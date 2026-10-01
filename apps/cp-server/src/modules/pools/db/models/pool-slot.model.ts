import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import {
  PoolSlotAccountTypeSchema,
  PoolSlotCycleStateSchema,
  PoolSlotOwnerStatusSchema,
  SlotMemberSchema,
} from "../../zod/pool-slot.zod";
import { IPPoolSchema } from "../../zod/pool.zod";
import type { IPoolSlot } from "../types/pool-slot.types";
import { BANK_ACCOUNTS, COMMUNITY_MEMBERS, POOL_SLOTS, POOLS } from "@/lib/definitions";
import { IPBankAccountSchema } from "@/modules/bank-accounts/zod/bank-account.zod";

const PoolSlotSchema: Schema = new Schema(
  {
    pool: { type: Schema.Types.ObjectId, ref: POOLS },
    position: Number,
    slotOwner: {
      member: { type: Schema.Types.ObjectId, ref: COMMUNITY_MEMBERS },
      status: { type: String, enum: PoolSlotOwnerStatusSchema.options },
    },
    cycleState: {
      state: { type: String, enum: PoolSlotCycleStateSchema.options },
      startDate: Date,
      endDate: Date,
    },
    paymentInfo: {
      slotAccountType: { type: String, enum: PoolSlotAccountTypeSchema.options },
      bankAccount: { type: Schema.Types.ObjectId, ref: BANK_ACCOUNTS },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(PoolSlotSchema);

const autoPopulate = function (this: Query<unknown, unknown>, next: () => void) {
  this.populate([{ transform, path: "pool", select: parseSelectFromSchema(IPPoolSchema) }]);
  this.populate([{ transform, path: "slotOwner.member", select: parseSelectFromSchema(SlotMemberSchema) }]);
  this.populate([{ transform, path: "paymentInfo.bankAccount", select: parseSelectFromSchema(IPBankAccountSchema) }]);
  next();
};

PoolSlotSchema.pre("findOne", autoPopulate).pre("findOneAndUpdate", autoPopulate).pre("find", autoPopulate);

export const PoolSlot: Model<IPoolSlot> = models[POOL_SLOTS] || model<IPoolSlot>(POOL_SLOTS, PoolSlotSchema);
