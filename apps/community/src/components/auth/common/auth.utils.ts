import type { Token } from "@packages/core/types";
import type { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import type { DeviceDoc, IDevice } from "../db/types/device.types";
import type { AuthToken, ISDevice, JwtPayload } from "./auth.dto";
import { getKeys } from "@/config/keys";
import type { ISUser } from "@/registries/dtos";

export class AuthUtils {
  static generateUserAuthToken(user: ISUser, hours: number) {
    const authPayload: JwtPayload = {
      id: user.id,
    };

    return new Promise<string>((resolve, reject) => {
      sign(authPayload, getKeys().secretKey, { expiresIn: 3600 * hours }, (err, token) => {
        if (err) return reject(err.message);
        if (token) return resolve(token);
      });
    });
  }

  static verifyUserToken(token: string) {
    const response: { jwt_payload: JwtPayload | null; err: string | null } = {
      jwt_payload: null,
      err: null,
    };
    try {
      verify(token, getKeys().secretKey, (err, jwt_payload) => {
        if (err) throw new Error(err.message);
        response.jwt_payload = jwt_payload as JwtPayload;
        return response;
      });
      return response;
    } catch (error) {
      if (error instanceof Error) response.err = String(error.message);
      return response;
    }
  }

  static setRefreshTokenToCookie(res: Response, loginTokens: AuthToken) {
    const { refreshToken, ...data } = loginTokens;
    res.cookie("rtk", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600 * 1000 * 24,
    });
    return { res, data };
  }

  static validateSessionToken(sessionToken: Token, token: string) {
    const now = Date.now();
    const response = { status: false, message: "Invalid token" };

    if (sessionToken.isEncrypted) {
      response.message = "Can't validate an encrypted token";
      return response;
    }

    if (!sessionToken.value || sessionToken.value !== token || sessionToken.expiry < now) {
      return response;
    }

    response.status = true;
    response.message = "Valid token";
    return response;
  }

  static sanitizeDevice(device: DeviceDoc) {
    const obj = device.toJSON();
    return obj as ISDevice;
  }
}
