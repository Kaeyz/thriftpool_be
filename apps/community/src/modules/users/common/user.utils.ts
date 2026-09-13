import { AppError, StatusCodes } from "@packages/core/res-config";
import * as resp from "../common/user.res";
import type { UserDoc } from "../db/user.types";
import type { ISUser, ValidateUserOptions } from "./user.dto";

const validateOptions: ValidateUserOptions = {
  isEmailVerified: true,
  isSuspended: true,
};

export class UserUtils {
  static validateUser(user: UserDoc | null, options = validateOptions) {
    const { isEmailVerified, isSuspended, userType } = options;
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, resp.USER_NOT_FOUND);
    if (isSuspended && user.isSuspended) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_ACCOUNT_SUSPENDED);
    if (isEmailVerified && !user.email.isVerified) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_ACCOUNT_NOT_VERIFIED);
    if (userType && userType !== user.userType) throw new AppError(StatusCodes.BAD_REQUEST, resp.WRONG_USER_TYPE);
    return user;
  }

  static sanitize(user: UserDoc): ISUser {
    const obj = user.toJSON();
    delete obj.token;
    delete obj.password;
    delete obj.updatedAt;
    return obj as unknown as ISUser;
  }
}
