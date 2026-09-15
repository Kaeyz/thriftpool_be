import { AppError, StatusCodes } from "@packages/core/res-config";
import type { AuthData, CreateUserInput, LoginInput, ResetPasswordInput } from "../common/auth.dto";
import { AuthUtils } from "../common/auth.utils";
import { getKeys } from "@/config/keys";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { UserAccountService, UserService } from "@/modules/users";

// Measured In Hours
const tokenExpiryPeriod = getKeys().appEnv === "prod" ? 0.04 : 1;

export class AuthService {
  static async loginWithPassword(ctx: Ctx, data: LoginInput) {
    const { data: user, message } = await UserService.loginUser(ctx, data);
    const authToken = await AuthUtils.generateUserAuthToken(user, tokenExpiryPeriod);
    const refreshToken = await AuthUtils.generateUserAuthToken(user, 24);
    return { data: { authToken, refreshToken } as AuthData, message };
  }

  static async refreshAuthToken(ctx: Ctx, refreshToken: string) {
    if (!refreshToken) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid token");
    const { err, jwt_payload } = await AuthUtils.verifyUserToken(refreshToken);
    if (err || !jwt_payload?.id) throw new AppError(StatusCodes.BAD_REQUEST, "Invalid token");
    const { data: user } = await UserService.getUserById(ctx, jwt_payload.id);
    const authToken = await AuthUtils.generateUserAuthToken(user!, tokenExpiryPeriod);
    return { data: { authToken }, message: "Auth token refreshed" };
  }
  static async registerUser(ctx: Ctx, newUser: CreateUserInput) {
    return UserAccountService.createUser(ctx, newUser);
  }
  static async initiateForgot(ctx: Ctx, emailAddress: string) {
    return UserService.initiateForgot(ctx, emailAddress);
  }

  static async setPassword(ctx: Ctx, resetData: ResetPasswordInput) {
    return UserService.resetPassword(ctx, resetData);
  }

  static async verifyToken(ctx: Ctx, token: string) {
    const { data } = await UserService.verifyToken(ctx, token);
    return { data: { isValid: data.isValid }, message: "Account verified" };
  }
}
