import type { z } from "zod";
import type {
  AdminOnboardingInputSchema,
  CreateUserSchema,
  ForgotPasswordSchema,
  LoginInputSchema,
  ResetPasswordSchema,
} from "../zod/auth.zod";

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type ForgotInput = z.infer<typeof ForgotPasswordSchema>;
export type AdminOnboardingInput = z.infer<typeof AdminOnboardingInputSchema>;

export type JwtPayload = {
  id: string;
  emailAddress: string;
};

export type AuthData = { authToken: string; refreshToken?: string };
