import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  AdminOnboardingInputSchema,
  CreateUserSchema,
  ForgotPasswordSchema,
  LoginInputSchema,
  LoginResponseSchema,
  ResetPasswordSchema,
  VerifyAccountInputSchema,
  VerifyAccountResponseSchema,
} from "../zod/auth.zod";

export const WebAppAuthSchemas = {
  CreateUserInput: z.toJSONSchema(CreateUserSchema),
  LoginInput: z.toJSONSchema(LoginInputSchema),
  LoginRes: z.toJSONSchema(HttpResponseSchema(LoginResponseSchema)),
  ResetPasswordInput: z.toJSONSchema(ResetPasswordSchema),
  RefreshTokenRes: z.toJSONSchema(HttpResponseSchema(LoginResponseSchema)),
  ForgotInput: z.toJSONSchema(ForgotPasswordSchema),
  ForgotRes: z.toJSONSchema(HttpResponseSchema()),
  VerifyAccountInput: z.toJSONSchema(VerifyAccountInputSchema),
  VerifyAccountRes: z.toJSONSchema(HttpResponseSchema(VerifyAccountResponseSchema)),
};
