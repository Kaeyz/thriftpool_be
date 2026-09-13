import { addVirtualId } from "@packages/core/database";
import { emailField, mediaFileField, phoneNumberField, tokenField } from "@packages/core/db-fields";
import type { Model } from "mongoose";
import { Schema, models, model } from "mongoose";
import { UserTypeSchema } from "../zod/user.zod";
import type { IUser } from "./user.types";

const UserSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String,
    otherNames: String,
    email: emailField,
    phoneNumber: phoneNumberField,
    profilePhoto: mediaFileField,
    isSuspended: { type: Boolean, default: false },
    userType: { type: String, enum: UserTypeSchema.options },
    password: String,
    token: tokenField,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(UserSchema);

UserSchema.index({
  firstName: "text",
  lastName: "text",
  otherNames: "text",
  "email.address": "text",
  "phone.number": "text",
});

UserSchema.index({ firstName: 1 });
UserSchema.index({ lastName: 1 });
UserSchema.index({ otherNames: 1 });
UserSchema.index({ customId: 1 });
UserSchema.index({ "email.address": 1 });
UserSchema.index({ "phone.number": 1 });

export const User: Model<IUser> = models["users"] || model<IUser>("users", UserSchema);
