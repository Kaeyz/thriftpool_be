import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetCommunityInvitesQuery } from "../common/community-invite.dto";
import { CommunityInviteService } from "../services/community-invite.service";

export class CommunityInviteController {
  static async getMyInvites(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir, status } = req.query as GetCommunityInvitesQuery;
    const ctx = req.ctx;
    const query: GetCommunityInvitesQuery = {
      limit,
      page,
      sortKey,
      sortDir,
      status,
      userId: ctx?.loggedInUser?.id,
      emailAddress: ctx?.loggedInUser?.email.address,
    };

    const serviceResponse = await CommunityInviteService.getCommunityInvites(ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getInvites(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir, status } = req.query as GetCommunityInvitesQuery;
    const query: GetCommunityInvitesQuery = { limit, page, sortKey, sortDir, status, communityId: req.ctx.community?.id };
    const serviceResponse = await CommunityInviteService.getCommunityInvites(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async sendNewInvite(req: Request, res: Response) {
    const serviceResponse = await CommunityInviteService.createNewInvite(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async processPendingInvite(req: Request, res: Response) {
    const serviceResponse = await CommunityInviteService.processPendingInvite(req.ctx, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
