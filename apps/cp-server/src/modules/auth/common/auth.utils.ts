import { sign, verify } from "jsonwebtoken";
import type { JwtPayload } from "./auth.dto";
import { getKeys } from "@/config/keys";
import type { Ctx } from "@/lib/ctx/ctx.types";
import type { RequestSource } from "@/lib/definitions";
import type { ISUser } from "@/modules/users/common/user.dto";

export class AuthUtils {
  static generateUserAuthToken(user: ISUser, hours: number) {
    const authPayload: JwtPayload = {
      id: user?.id,
      emailAddress: user.email.address,
    };

    return new Promise<string>((resolve, reject) => {
      sign(authPayload, getKeys().secretKey, { expiresIn: 3600 * hours }, (err, token) => {
        if (err || !token) return reject(err);
        return resolve(token);
      });
    });
  }

  static getRefreshTokenKey(ctx: Ctx) {
    const keys: Record<RequestSource, string> = {
      system: "sys",
      "web-app": "web",
    };

    return `${keys[ctx?.requestSource]}rtk`;
  }

  static async verifyUserToken(token: string) {
    const response: { jwt_payload: JwtPayload | null; err: string | null } = {
      jwt_payload: null,
      err: null,
    };
    try {
      verify(token, getKeys().secretKey, (err, jwt_payload) => {
        if (err) throw err;
        response.jwt_payload = jwt_payload as JwtPayload;
        return response;
      });
      return response;
    } catch (error) {
      response.err = String((error as Error).message);
      return response;
    }
  }
}
