import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import {
  CommunityInCommunityMemberSchema,
  CommunityMemberRoleSchema,
  CommunityMemberStatusSchema,
  UserInCommunityMemberSchema,
} from "../zod/community-member.zod";
import type { ICommunityMember } from "./community-member.types";
import { USERS, COMMUNITY_MEMBERS, COMMUNITIES } from "@/lib/definitions";

const CommunityMemberSchema: Schema = new Schema(
  {
    emailAddress: { type: String },
    community: { type: Schema.Types.ObjectId, ref: COMMUNITIES },
    user: { type: Schema.Types.ObjectId, ref: USERS },
    role: { type: String, enum: CommunityMemberRoleSchema.options },
    status: { type: String, enum: CommunityMemberStatusSchema.options },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(CommunityMemberSchema);

const autoPopulate = function (this: Query<unknown, unknown>, next: () => void) {
  this.populate([{ transform, path: "community", select: parseSelectFromSchema(CommunityInCommunityMemberSchema) }]);
  this.populate([{ transform, path: "user", select: parseSelectFromSchema(UserInCommunityMemberSchema) }]);
  next();
};

CommunityMemberSchema.pre("findOne", autoPopulate).pre("findOneAndUpdate", autoPopulate).pre("find", autoPopulate);

export const CommunityMember: Model<ICommunityMember> =
  models[COMMUNITY_MEMBERS] || model<ICommunityMember>(COMMUNITY_MEMBERS, CommunityMemberSchema);
