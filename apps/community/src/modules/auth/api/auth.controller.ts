import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import { AuthUtils } from "../common/auth.utils";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async getLoggedInUser(req: Request, res: Response) {
    const serviceResponse = { data: req.ctx.loggedInUser };
    return getApiSuccessResponse(res, serviceResponse);
  }
  static async registerUser(req: Request, res: Response) {
    const serviceResponse = await AuthService.registerUser(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async loginWithPassword(req: Request, res: Response) {
    const serviceResponse = await AuthService.loginWithPassword(req.ctx, req.body);
    const tokenKey = AuthUtils.getRefreshTokenKey(req.ctx);
    res.cookie(tokenKey, serviceResponse.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600 * 1000 * 24,
    });
    delete serviceResponse.data.refreshToken;
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async refreshAuthToken(req: Request, res: Response) {
    const cookies = req.cookies;
    const tokenKey = AuthUtils.getRefreshTokenKey(req.ctx);
    const serviceResponse = await AuthService.refreshAuthToken(req.ctx, cookies[tokenKey]);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async initiateForgot(req: Request, res: Response) {
    const serviceResponse = await AuthService.initiateForgot(req.ctx, req.body.emailAddress);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async verifyAccount(req: Request, res: Response) {
    const serviceResponse = await AuthService.verifyToken(req.ctx, req.body.token);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async setPassword(req: Request, res: Response) {
    const serviceResponse = await AuthService.setPassword(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
