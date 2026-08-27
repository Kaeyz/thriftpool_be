import type { Token } from "@packages/core/types";
import type { Document } from "mongoose";
import type * as z from "zod";
import type { AuthSessionSchema } from "../../common/auth.zod";

export type IAuthSession = {
  profile: string;
  token: Token;
  refreshToken: Token;
  device: string;
};

export type AuthSessionDoc = z.infer<typeof AuthSessionSchema> & Document;
