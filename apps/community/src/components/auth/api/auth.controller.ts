import { getApiSuccessResponse } from "@packages/core/http";
import type { Request, Response } from "express";
import { AuthUtils } from "../common/auth.utils";
import { AuthApiService } from "./auth.api-service";

export class AuthController {
  static async getLoggedInUser(req: Request, res: Response) {
    const serviceResponse = { data: req.ctx.loggedInUser };
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async setPassword(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.setPassword(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async loginWithPassword(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.loginWithPassword(req.ctx, req.body);
    const { data, res: newRes } = AuthUtils.setRefreshTokenToCookie(res, serviceResponse.data);
    const responseData = { ...serviceResponse, data };
    return getApiSuccessResponse(newRes, responseData);
  }

  static async refreshAuthToken(req: Request, res: Response) {
    const cookies = req.cookies;
    const serviceResponse = await AuthApiService.refreshAuthToken(req.ctx, cookies["rtk"]);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async initiateForgot(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.initiateForgot(req.ctx, req.body.emailAddress);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async signup(req: Request, res: Response) {
    const { ctx, body } = req;
    const serviceResponse = await AuthApiService.signup(ctx, body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async verifyAccount(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.verifyAccount(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async verifyResetToken(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.verifyResetToken(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async verifyAuthSessionToken(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.validateAuthSessionToken(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async verifyAuthSessionRefreshToken(req: Request, res: Response) {
    const serviceResponse = await AuthApiService.validateAuthSessionRefreshToken(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
