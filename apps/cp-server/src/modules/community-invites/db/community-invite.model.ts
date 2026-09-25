import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import {
  CommunityInCommunityInviteSchema,
  CommunityInviteStatusSchema,
  UserInCommunityInviteSchema,
} from "../zod/community-invite.zod";
import type { ICommunityInvite } from "./community-invite.types";
import { USERS, COMMUNITY_INVITES, COMMUNITIES } from "@/lib/definitions";

const CommunityInviteSchema: Schema = new Schema(
  {
    emailAddress: { type: String },
    community: { type: Schema.Types.ObjectId, ref: COMMUNITIES },
    user: { type: Schema.Types.ObjectId, ref: USERS },
    status: { type: String, enum: CommunityInviteStatusSchema.options },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(CommunityInviteSchema);

const autoPopulate = function (this: Query<unknown, unknown>, next: () => void) {
  this.populate([{ transform, path: "user", select: parseSelectFromSchema(UserInCommunityInviteSchema) }]);
  this.populate([{ transform, path: "community", select: parseSelectFromSchema(CommunityInCommunityInviteSchema) }]);
  next();
};

CommunityInviteSchema.pre("findOne", autoPopulate).pre("findOneAndUpdate", autoPopulate).pre("find", autoPopulate);

export const CommunityInvite: Model<ICommunityInvite> =
  models[COMMUNITY_INVITES] || model<ICommunityInvite>(COMMUNITY_INVITES, CommunityInviteSchema);
