import { ApiError, StatusCodes } from "@packages/core/http";
import { generateTokenAndExpiry } from "@packages/core/token";
import { expiryTimes } from "../common/auth.const";
import type {
  LoginInput,
  SessionRefreshTokenInput,
  SessionTokenInput,
  SetPasswordInput,
  SignupInput,
  VerifyTokenInput,
} from "../common/auth.dto";
import * as responses from "../common/auth.resp";
import { AuthUtils } from "../common/auth.utils";
import { AuthSessionRepository } from "../db/repos/auth-session.repo";
import { DeviceRepository } from "../db/repos/device.repo";
import { encryptionService } from "@/lib/helpers/encryption";
import type { Ctx } from "@/lib/request-context/config";
import { OrgApiService, ProfileApiService, UserApiService } from "@/registries/api-services";
import { OrgService } from "@/registries/services";

export class AuthApiService {
  static async loginWithPassword(ctx: Ctx, data: LoginInput) {
    const { data: accountOrg } = await OrgService.getAccountOrg(ctx);
    const { data: org } = await OrgApiService.getOrgById(ctx, data.orgId);
    const { data: user, message } = await UserApiService.authenticateUserWithPassword(ctx, data);
    const { data: profile } = await ProfileApiService.getProfile(ctx, { orgId: org.id, userId: user.id });

    let deviceId = ctx.deviceId || "";
    if (deviceId) {
      const device = await DeviceRepository.getById(ctx, deviceId);
      if (!device) deviceId = "";
    }
    if (!deviceId && ctx.userAgent) {
      const device = await DeviceRepository.create(ctx, { user: user.id, ...ctx.userAgent });
      deviceId = device.id;
    }

    const authToken = await AuthUtils.generateUserAuthToken(user!, expiryTimes.fifteenMins);
    const refreshToken = await AuthUtils.generateUserAuthToken(user!, expiryTimes.oneDay);
    let sessionToken: string | undefined = undefined;
    let redirectUrl: string | undefined = undefined;
    let sessionId: string | undefined = undefined;

    const loginResponseData = { authToken, refreshToken, idpToken: undefined, redirectUrl: "" };
    if (accountOrg.id !== org.id) {
      const token = generateTokenAndExpiry(6, expiryTimes.fifteenMins);
      const authSession = await AuthSessionRepository.create(ctx, {
        device: deviceId,
        profile: profile.id,
        token,
        refreshToken: null,
      });
      sessionToken = authSession.token?.value;
      redirectUrl = org.customUrl || org.platform.defaultUrl;
      sessionId = authSession.id;
    }
    return { data: { ...loginResponseData, sessionToken, sessionId, redirectUrl, deviceId }, message };
  }

  static async validateAuthSessionToken(ctx: Ctx, data: SessionTokenInput) {
    let authSession = await AuthSessionRepository.getById(ctx, data.sessionId);
    if (!authSession || !authSession.token) throw new ApiError(StatusCodes.NOT_FOUND, responses.SESSION_NOT_FOUND);

    const tokenIsValidRes = AuthUtils.validateSessionToken(authSession.token, data.token);
    if (!tokenIsValidRes.status) {
      await AuthSessionRepository.delete(ctx, authSession.id);
      throw new ApiError(StatusCodes.BAD_REQUEST, tokenIsValidRes.message);
    }

    const refreshToken = generateTokenAndExpiry(10, expiryTimes.oneWeek);
    const encrypted = encryptionService.encryptString(refreshToken.value || "");

    authSession = await AuthSessionRepository.update(ctx, authSession.id, {
      token: null,
      refreshToken: {
        expiry: refreshToken.expiry,
        isEncrypted: true,
        value: encrypted.value,
        key: encrypted.key,
      },
      profile: String(authSession.profile),
      device: String(authSession.device),
    });

    return { data: { refreshToken: refreshToken.value, sessionId: data.sessionId } };
  }

  static async validateAuthSessionRefreshToken(ctx: Ctx, data: SessionRefreshTokenInput) {
    let authSession = await AuthSessionRepository.getById(ctx, data.sessionId);
    if (!authSession || !authSession.refreshToken) throw new ApiError(StatusCodes.NOT_FOUND, responses.SESSION_NOT_FOUND);

    let refreshToken = authSession.refreshToken;
    if (!refreshToken.isEncrypted || !refreshToken.key) throw new ApiError(StatusCodes.NOT_FOUND, responses.INVALID_TOKEN);

    refreshToken.value = encryptionService.decryptString(refreshToken.value, refreshToken.key);
    refreshToken.isEncrypted = false;

    const tokenIsValidRes = AuthUtils.validateSessionToken(refreshToken, data.refreshToken);
    if (!tokenIsValidRes.status) {
      await AuthSessionRepository.delete(ctx, authSession.id);
      throw new ApiError(StatusCodes.BAD_REQUEST, tokenIsValidRes.message);
    }

    refreshToken = generateTokenAndExpiry(10, expiryTimes.oneWeek);
    const encrypted = encryptionService.encryptString(refreshToken.value || "");

    authSession = await AuthSessionRepository.update(ctx, data.sessionId, {
      token: null,
      refreshToken: {
        expiry: refreshToken.expiry,
        isEncrypted: true,
        value: encrypted.value,
        key: encrypted.key,
      },
      profile: String(authSession.profile),
      device: String(authSession.device),
    });

    return { data: { refreshToken: refreshToken.value, sessionId: data.sessionId } };
  }

  static async refreshAuthToken(ctx: Ctx, refreshToken: string) {
    if (!refreshToken) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid token");
    const { err, jwt_payload } = await AuthUtils.verifyUserToken(refreshToken);
    if (err || !jwt_payload) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid token");
    const { data: user } = await UserApiService.getUser(ctx, jwt_payload.id);
    const authToken = await AuthUtils.generateUserAuthToken(user!, 0.04);
    return { data: { authToken }, message: "Auth token refreshed" };
  }

  static setPassword(ctx: Ctx, resetData: SetPasswordInput) {
    return UserApiService.resetPassword(ctx, resetData);
  }

  static verifyAccount(ctx: Ctx, data: VerifyTokenInput) {
    return UserApiService.verifyToken(ctx, data.token);
  }

  static verifyResetToken(ctx: Ctx, data: VerifyTokenInput) {
    return UserApiService.verifyToken(ctx, data.token, { deleteToken: false });
  }

  static initiateForgot(ctx: Ctx, emailAddress: string) {
    return UserApiService.initiateForgot(ctx, emailAddress);
  }

  static signup(ctx: Ctx, data: SignupInput) {
    return UserApiService.createUser(ctx, data);
  }
}
