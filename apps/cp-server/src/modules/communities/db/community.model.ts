import { addVirtualId } from "@packages/core/database";
import { mediaFileField } from "@packages/core/db-fields";
import type { Model } from "mongoose";
import { Schema, models, model } from "mongoose";
import { CommunityVisibilitySchema } from "../zod/community.zod";
import type { ICommunity } from "./community.types";
import { COMMUNITIES } from "@/lib/definitions";

const CommunitySchema: Schema = new Schema(
  {
    name: String,
    description: String,
    key: String,
    logo: mediaFileField,
    isSuspended: { type: Boolean, default: false },
    visibility: { type: String, enum: CommunityVisibilitySchema.options },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(CommunitySchema);

CommunitySchema.index({ name: "text", key: "text", description: "text" });

CommunitySchema.index({ name: 1 });
CommunitySchema.index({ key: 1 });
CommunitySchema.index({ description: 1 });

export const Community: Model<ICommunity> = models[COMMUNITIES] || model<ICommunity>(COMMUNITIES, CommunitySchema);
