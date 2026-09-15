import { FieldSchemas } from "@packages/core/field-schema";
import {
  EmailSchema,
  PhoneNumberSchema,
  TokenSchema,
  PageInputSchema,
  LimitInputSchema,
  SortDirectionSchema,
} from "@packages/core/zod-schemas";
import * as z from "zod";
import { MediaFileSchema } from "@/lib/file-upload";

export const UserTypeSchema = z.enum(["user", "admin"]);

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: EmailSchema,
  phoneNumber: PhoneNumberSchema,
  profilePhoto: MediaFileSchema,
  isSuspended: z.boolean(),
  userType: UserTypeSchema,
  password: z.string(),
  token: TokenSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPUserSchema = UserSchema.pick({ id: true, firstName: true, lastName: true, email: true });

export const ISUserSchema = UserSchema.omit({
  token: true,
  password: true,
  updatedAt: true,
});

export const UsersQueryResponse = z.object({
  data: z.array(UserSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const UpdateMyProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const UpdateMyEmailSchema = z.object({
  newEmailAddress: FieldSchemas.emailSchema("New Email Address"),
  password: FieldSchemas.passwordSchema("Password"),
});

export const UpdateMyPasswordSchema = z
  .object({
    currentPassword: FieldSchemas.passwordSchema("currentPassword"),
    newPassword: FieldSchemas.passwordSchema("newPassword"),
    confirmPassword: FieldSchemas.passwordSchema("confirmPassword"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.currentPassword === data.currentPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export const UserSortKeySchema = z.enum(["firstName", "lastName", "emailAddress", "phoneNumber", "createdAt"]);
export const UsersQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  userType: FieldSchemas.enumSelectSchema("userType", UserTypeSchema).optional(),
  isSuspended: z.enum(["true", "false"]).optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", UserSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
