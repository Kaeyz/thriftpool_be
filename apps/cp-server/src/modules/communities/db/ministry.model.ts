import { mediaFileField, MINISTRIES } from "@/lib/definitions";
import { addVirtualId } from "@/lib/helpers";
import { Schema, Model, models, model } from "mongoose";
import { IMinistry } from "./ministry.types";

const MinistrySchema: Schema = new Schema(
  {
    name: String,
    key: String,
    logo: mediaFileField,
    isSuspended: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(MinistrySchema);

MinistrySchema.index({ name: "text", key: "text" });

MinistrySchema.index({ name: 1 });
MinistrySchema.index({ key: 1 });

export const Ministry: Model<IMinistry> = models[MINISTRIES] || model<IMinistry>(MINISTRIES, MinistrySchema);
