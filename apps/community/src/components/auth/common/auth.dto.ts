import type * as z from "zod";
import type {
  AuthSessionInputSchema,
  DeviceInputSchema,
  DeviceSchema,
  ForgotInputSchema,
  LoginInputSchema,
  SessionRefreshTokenInputSchema,
  SessionTokenInputSchema,
  SetPasswordInputSchema,
  SignupInputSchema,
  VerifyTokenInputSchema,
} from "./auth.zod";

export type SetPasswordInput = z.infer<typeof SetPasswordInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type ForgotInput = z.infer<typeof ForgotInputSchema>;
export type SignupInput = z.infer<typeof SignupInputSchema>;
export type VerifyTokenInput = z.infer<typeof VerifyTokenInputSchema>;
export type AuthSessionInput = z.infer<typeof AuthSessionInputSchema>;
export type DeviceInput = z.infer<typeof DeviceInputSchema>;
export type SessionTokenInput = z.infer<typeof SessionTokenInputSchema>;
export type SessionRefreshTokenInput = z.infer<typeof SessionRefreshTokenInputSchema>;

export type ISDevice = z.infer<typeof DeviceSchema>;

export type AuthToken = {
  refreshToken: string;
  authToken: string;
};

export type JwtPayload = {
  id: string;
};
