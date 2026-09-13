import type { Email, PhoneNumber, MediaFile, Token } from "@packages/core/types";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { UserType } from "../common/user.dto";
import type { UserSchema } from "../zod/user.zod";

export type IUser = {
  firstName: string;
  lastName: string;
  email: Email;
  phoneNumber: PhoneNumber;
  profilePhoto: MediaFile;
  isSuspended: boolean;
  userType: UserType;
  roles: string[];
  password: string;
  token: Token | null;
};

export type IUserInput = Partial<IUser>;

export type UserDoc = z.infer<typeof UserSchema> & Document;
