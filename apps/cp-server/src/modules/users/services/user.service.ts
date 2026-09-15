import { AppError, StatusCodes } from "@packages/core/res-config";
import { compareHash, generateTokenAndExpiry, hashValue } from "@packages/core/token";
import type {
  GetUsersQuery,
  UpdateMyEmailInput,
  UpdateMyPasswordInput,
  UpdateMyProfileInput,
  ValidateUserOptions,
} from "../common/user.dto";
import * as resp from "../common/user.res";
import { UserUtils } from "../common/user.utils";
import { UserRepo } from "../db/user.repo";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { emailService } from "@/lib/helpers/email";
import type { LoginInput, ResetPasswordInput } from "@/modules/auth/common/auth.dto";

export class UserService {
  static async loginUser(ctx: Ctx, loginData: LoginInput) {
    const user = await UserRepo.getByEmail(ctx, loginData.emailAddress);
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.AUTHENTICATION_FAILED);

    const isMatch = await compareHash(user.password, loginData?.password);
    if (!isMatch) throw new AppError(StatusCodes.BAD_REQUEST, resp.AUTHENTICATION_FAILED);

    return { data: UserUtils.sanitize(user), message: resp.LOGIN_SUCCESSFUL };
  }

  static async verifyToken(ctx: Ctx, token: string) {
    let user = await UserRepo.getByToken(ctx, token);
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.INVALID_TOKEN);

    user = await UserRepo.update(ctx, user.id, {
      token: null,
      email: { address: user.email.address, isVerified: true },
    });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_ACCOUNT_NOT_VERIFIED);

    return {
      data: { isValid: !!user, user: UserUtils.sanitize(user) },
      message: resp.TOKEN_VALIDATED,
    };
  }

  static async initiateForgot(ctx: Ctx, emailAddress: string) {
    let user = await UserRepo.getByEmail(ctx, emailAddress);

    // intentionally sending 200 Here to prevent users from using this to test which emails are on the platform
    // Also casting the response message to lowercase to differentiate it from the actual success response.
    if (!user) throw new AppError(StatusCodes.SUCCESS, resp.TOKEN_SENT.toLocaleLowerCase());

    const token = generateTokenAndExpiry();
    user = await UserRepo.update(ctx, user.id, { token });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_NOT_FOUND);

    await emailService.send("forgotPassword", user.email.address, { name: user.firstName, token: user.token.value });
    return { message: resp.TOKEN_SENT };
  }

  static async requestAccountVerification(ctx: Ctx) {
    const userId = ctx.loggedInUser?.id || "";

    const token = generateTokenAndExpiry();
    const user = await UserRepo.update(ctx, userId, { token });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_NOT_FOUND);

    await emailService.send("verifyAccount", user.email.address, { name: user.firstName, token: user.token.value });
    return { message: resp.TOKEN_SENT };
  }

  static async resetPassword(ctx: Ctx, resetData: ResetPasswordInput) {
    let user = await UserRepo.getByToken(ctx, resetData.token);
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.INVALID_TOKEN);

    const passwordHash = await hashValue(resetData?.password || "");

    user = await UserRepo.update(ctx, user.id, {
      password: passwordHash,
      token: null,
      email: { address: user.email.address, isVerified: true },
    });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_NOT_FOUND);

    return { data: UserUtils.sanitize(user), message: resp.PASSWORD_SET_SUCCESSFUL };
  }

  static async getUserById(ctx: Ctx, id: string, options?: ValidateUserOptions) {
    let user = await UserRepo.getById(ctx, id);
    if (options) user = UserUtils.validateUser(user, options);
    return { data: user ? UserUtils.sanitize(user) : null };
  }

  static async getUserByEmail(ctx: Ctx, emailAddress: string, options?: ValidateUserOptions) {
    let user = await UserRepo.getByEmail(ctx, emailAddress);
    if (options) user = UserUtils.validateUser(user, options);
    return { data: user ? UserUtils.sanitize(user) : null };
  }

  static async getUsers(ctx: Ctx, query: GetUsersQuery) {
    const data = await UserRepo.getAll(ctx, query);
    return { data };
  }

  static async updateMyProfile(ctx: Ctx, newProfile: UpdateMyProfileInput) {
    const { loggedInUser } = ctx;
    const user = await UserRepo.update(ctx, loggedInUser?.id || "", {
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
    });
    if (!user) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_NOT_FOUND);
    return { data: UserUtils.sanitize(user), message: resp.PROFILE_UPDATED };
  }

  static async updateMyEmail(ctx: Ctx, newEmail: UpdateMyEmailInput) {
    const userId = ctx.loggedInUser?.id || "";
    let user = await UserRepo.getById(ctx, userId);
    user = UserUtils.validateUser(user);

    if (!user.password) throw new AppError(StatusCodes.BAD_REQUEST, resp.AUTHENTICATION_FAILED);

    const isMatch = await compareHash(user.password, newEmail.password);
    if (!isMatch) throw new AppError(StatusCodes.BAD_REQUEST, resp.AUTHENTICATION_FAILED);

    const userWithEmailExist = await UserRepo.getByEmail(ctx, newEmail.newEmailAddress);
    if (userWithEmailExist && userWithEmailExist.email.address !== user.email.address)
      throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_WITH_EMAIL_EXIST);

    user = await UserRepo.update(ctx, userId, { email: { address: newEmail.newEmailAddress, isVerified: false } });
    user = UserUtils.validateUser(user);
    return { data: UserUtils.sanitize(user), message: resp.EMAIL_UPDATED };
  }

  static async updateMyPassword(ctx: Ctx, newPasswordData: UpdateMyPasswordInput) {
    const userId = ctx?.loggedInUser?.id || "";
    let user = await UserRepo.getById(ctx, userId);
    user = UserUtils.validateUser(user);

    if (!user.password) throw new AppError(StatusCodes.BAD_REQUEST, resp.AUTHENTICATION_FAILED);

    const isMatch = await compareHash(user.password, newPasswordData.currentPassword);
    if (!isMatch) throw new AppError(StatusCodes.BAD_REQUEST, resp.AUTHENTICATION_FAILED);

    const passwordHash = await hashValue(newPasswordData?.newPassword || "");
    user = await UserRepo.update(ctx, user.id, { password: passwordHash });
    user = UserUtils.validateUser(user);

    return { data: UserUtils.sanitize(user), message: resp.PASSWORD_SET_SUCCESSFUL };
  }
}
