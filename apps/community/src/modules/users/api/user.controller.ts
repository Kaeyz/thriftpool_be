import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetUsersQuery } from "../common/user.dto";
import { UserService } from "../services/user.service";

export class UserController {
  static async requestAccountVerification(req: Request, res: Response) {
    const serviceResponse = await UserService.requestAccountVerification(req.ctx);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateMyProfile(req: Request, res: Response) {
    const serviceResponse = await UserService.updateMyProfile(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateMyEmail(req: Request, res: Response) {
    const serviceResponse = await UserService.updateMyEmail(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateMyPassword(req: Request, res: Response) {
    const serviceResponse = await UserService.updateMyPassword(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getUsers(req: Request, res: Response) {
    const { search, limit, page, isSuspended, sortDir, sortKey } = req.query as GetUsersQuery;
    const query: GetUsersQuery = { search, limit, page, userType: "user", isSuspended, sortDir, sortKey };
    const serviceResponse = await UserService.getUsers(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
