import type { z } from "zod";
import type {
  IPUserSchema,
  ISUserSchema,
  UpdateMyEmailSchema,
  UpdateMyPasswordSchema,
  UpdateMyProfileSchema,
  UserSortKeySchema,
  UsersQueryInputSchema,
  UserTypeSchema,
} from "../zod/user.zod";

export type ISUser = z.infer<typeof ISUserSchema>;
export type IPUser = z.infer<typeof IPUserSchema>;

export type UserType = z.infer<typeof UserTypeSchema>;
export type UserSortKey = z.infer<typeof UserSortKeySchema>;

export type GetUsersQuery = z.infer<typeof UsersQueryInputSchema>;

export type UpdateMyProfileInput = z.infer<typeof UpdateMyProfileSchema>;
export type UpdateMyEmailInput = z.infer<typeof UpdateMyEmailSchema>;
export type UpdateMyPasswordInput = z.infer<typeof UpdateMyPasswordSchema>;

export type ValidateUserOptions = {
  isEmailVerified?: boolean;
  isSuspended?: boolean;
  userType?: UserType;
};
