import { FieldSchemas } from "@packages/core/field-schema";
import { TokenSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { profileZodSchemas, userZodSchemas } from "@/registries/zod-schemas";

export const SetPasswordInputSchema = z
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
  orgId: FieldSchemas.dbIdSchema("orgId"),
  emailAddress: FieldSchemas.emailSchema("emailAddress"),
  password: FieldSchemas.passwordSchema("password"),
});

export const LoginResponse = z.object({
  authToken: z.jwt(),
  sessionToken: z.string().optional(),
  redirectUrl: z.httpUrl().optional(),
  deviceId: FieldSchemas.dbIdSchema("deviceId"),
});

export const VerifyTokenInputSchema = z.object({
  token: FieldSchemas.tokenSchema("token"),
});

export const ForgotInputSchema = z.object({
  emailAddress: FieldSchemas.emailSchema(),
});

export const SignupInputSchema = z.object({
  firstName: FieldSchemas.nameSchema("firstName"),
  lastName: FieldSchemas.nameSchema("lastName"),
  otherNames: FieldSchemas.nameSchema("otherNames").optional(),
  emailAddress: FieldSchemas.emailSchema("primaryEmailAddress"),
  password: FieldSchemas.passwordSchema("password"),
  orgId: FieldSchemas.dbIdSchema("orgId"),
});

export const SessionTokenInputSchema = z.object({
  sessionId: FieldSchemas.dbIdSchema("sessionId"),
  token: FieldSchemas.textSchema("token"),
});

export const SessionRefreshTokenInputSchema = z.object({
  sessionId: FieldSchemas.dbIdSchema("sessionId"),
  refreshToken: FieldSchemas.textSchema("refreshToken"),
});

export const SessionTokenResponseSchema = z.object({
  sessionId: FieldSchemas.dbIdSchema("sessionId"),
  refreshToken: FieldSchemas.textSchema("refreshToken"),
});

export const UserInDeviceSchema = userZodSchemas.ISUserSchema;

export const DeviceSchema = z.object({
  id: z.string(),
  user: UserInDeviceSchema,
  deviceType: z.string(),
  platform: z.string(),
  os: z.string(),
  country: z.string(),
  browser: z.string().optional(),
  deviceModel: z.string().optional(),
  appVersion: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const DeviceInputSchema = DeviceSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const ProfileInAuthSessionSchema = profileZodSchemas.ProfileSchema;

export const AuthSessionSchema = z.object({
  id: z.string(),
  profile: ProfileInAuthSessionSchema,
  token: TokenSchema.nullable(),
  refreshToken: TokenSchema.nullable(),
  device: DeviceSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const AuthSessionInputSchema = AuthSessionSchema.omit({ id: true, createdAt: true, updatedAt: true });
