import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import {
  PoolAdminSchema,
  PoolCommunitySchema,
  PoolPaymentIntervalSchema,
  PoolPaymentModeSchema,
  PoolStatusSchema,
} from "../zod/pool.zod";
import type { IPool } from "./pool.types";
import { COMMUNITIES, COMMUNITY_MEMBERS, POOLS } from "@/lib/definitions";

const PoolSchema: Schema = new Schema(
  {
    community: { type: Schema.Types.ObjectId, ref: COMMUNITIES },
    name: String,
    description: String,
    amount: Number,
    currency: String,
    paymentInterval: { type: String, enum: PoolPaymentIntervalSchema.options },
    paymentMode: { type: String, enum: PoolPaymentModeSchema.options },
    noOFSlots: Number,
    admins: { type: Schema.Types.ObjectId, ref: COMMUNITY_MEMBERS },
    status: { type: String, enum: PoolStatusSchema.options },
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
  this.populate([{ transform, path: "admins", select: parseSelectFromSchema(PoolAdminSchema) }]);
  next();
};

PoolSchema.pre("findOne", autoPopulate).pre("findOneAndUpdate", autoPopulate).pre("find", autoPopulate);

export const Pool: Model<IPool> = models[POOLS] || model<IPool>(POOLS, PoolSchema);
