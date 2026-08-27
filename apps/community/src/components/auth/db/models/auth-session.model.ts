import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import { tokenField } from "@packages/core/db-fields";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import { DeviceSchema, ProfileInAuthSessionSchema } from "../../common/auth.zod";
import type { AuthSessionDoc, IAuthSession } from "../types/auth-session.types";

const AuthSessionModel: Schema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: "profiles" },
    device: { type: Schema.Types.ObjectId, ref: "devices" },
    token: tokenField,
    refreshToken: tokenField,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(AuthSessionModel);

const autoPopulate = function (this: Query<AuthSessionDoc, IAuthSession>, next: () => void) {
  this.populate([
    { transform, path: "profile", select: parseSelectFromSchema(ProfileInAuthSessionSchema) },
    { transform, path: "device", select: parseSelectFromSchema(DeviceSchema) },
  ]);
  next();
};

AuthSessionModel.pre(["findOne", "findOneAndUpdate", "find"], autoPopulate);

const AuthSession: Model<IAuthSession> = models.auth_sessions || model<IAuthSession>("auth_sessions", AuthSessionModel);

export default AuthSession;
