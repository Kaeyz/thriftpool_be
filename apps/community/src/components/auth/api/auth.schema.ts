import { APIResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  ForgotInputSchema,
  SetPasswordInputSchema,
  LoginInputSchema,
  SignupInputSchema,
  LoginResponse,
  VerifyTokenInputSchema,
  SessionTokenResponseSchema,
  SessionTokenInputSchema,
  SessionRefreshTokenInputSchema,
} from "../common/auth.zod";
import { userZodSchemas } from "@/registries/zod-schemas";

export const webAppAuthSchemas = {
  SetPasswordInput: z.toJSONSchema(SetPasswordInputSchema),
  LoginInput: z.toJSONSchema(LoginInputSchema),
  ForgotInput: z.toJSONSchema(ForgotInputSchema),
  SignupInput: z.toJSONSchema(SignupInputSchema),
  VerifyTokenInput: z.toJSONSchema(VerifyTokenInputSchema),

  SetPassword: z.toJSONSchema(APIResponseSchema(userZodSchemas.UserSchema)),
  Forgot: z.toJSONSchema(APIResponseSchema()),
  Login: z.toJSONSchema(APIResponseSchema(LoginResponse)),
  RefreshToken: z.toJSONSchema(APIResponseSchema()),
  Verify: z.toJSONSchema(APIResponseSchema()),
};

export const serverApiAuthSchemas = {
  SessionTokenInput: z.toJSONSchema(SessionTokenInputSchema),
  SessionRefreshTokenInput: z.toJSONSchema(SessionRefreshTokenInputSchema),

  SessionTokenResponse: z.toJSONSchema(APIResponseSchema(SessionTokenResponseSchema)),
};
