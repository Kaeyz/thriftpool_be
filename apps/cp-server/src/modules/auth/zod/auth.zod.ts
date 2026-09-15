import { FieldSchemas } from "@packages/core/field-schema";
import * as z from "zod";

export const ResetPasswordSchema = z
  .object({
    token: FieldSchemas.tokenSchema(),
    password: FieldSchemas.passwordSchema(),
    confirmPassword: FieldSchemas.passwordSchema("confirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const LoginInputSchema = z.object({
  emailAddress: FieldSchemas.emailSchema(),
  password: FieldSchemas.passwordSchema(),
});

export const LoginResponseSchema = z.object({
  authToken: z.jwt(),
});

export const CreateUserSchema = z.object({
  firstName: FieldSchemas.nameSchema("firstName"),
  lastName: FieldSchemas.nameSchema("lastName"),
  emailAddress: FieldSchemas.emailSchema(),
  password: FieldSchemas.passwordSchema(),
});

export const AdminOnboardingInputSchema = z.object({
  token: FieldSchemas.tokenSchema(),
  firstName: FieldSchemas.nameSchema("First Name"),
  lastName: FieldSchemas.nameSchema("Last Name"),
});

export const ForgotPasswordSchema = z.object({
  emailAddress: FieldSchemas.emailSchema(),
});

export const VerifyAccountInputSchema = z.object({
  token: FieldSchemas.tokenSchema(),
});

export const VerifyAccountResponseSchema = z.object({
  isValid: FieldSchemas.booleanSchema("isValid"),
});
