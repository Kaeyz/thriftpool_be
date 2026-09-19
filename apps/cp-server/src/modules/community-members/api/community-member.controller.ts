import { getApiSuccessResponse } from "@packages/runtime/http";
import type { Request, Response } from "express";
import type { GetCommunityMembersQuery } from "../common/community-member.dto";
import { CommunityMemberService } from "../services/community-member.service";

export class CommunityMemberController {
  static async getMyMemberShips(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir, status } = req.query as GetCommunityMembersQuery;
    const ctx = req.ctx;
    const query: GetCommunityMembersQuery = {
      limit,
      page,
      sortKey,
      sortDir,
      status,
      userId: ctx?.loggedInUser?.id,
    };

    const serviceResponse = await CommunityMemberService.getCommunityMembers(ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async getMembers(req: Request, res: Response) {
    const { limit, page, sortKey, sortDir, status } = req.query as GetCommunityMembersQuery;
    const query: GetCommunityMembersQuery = { limit, page, sortKey, sortDir, status, communityId: req.ctx.community?.id };
    const serviceResponse = await CommunityMemberService.getCommunityMembers(req.ctx, query);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async updateMemberRole(req: Request, res: Response) {
    const memberId = req.params.memberId as string;
    const serviceResponse = await CommunityMemberService.updateMemberRole(req.ctx, memberId, req.body);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async suspendMember(req: Request, res: Response) {
    const memberId = req.params.memberId as string;
    const serviceResponse = await CommunityMemberService.suspendMember(req.ctx, memberId);
    return getApiSuccessResponse(res, serviceResponse);
  }

  static async unSuspendMember(req: Request, res: Response) {
    const memberId = req.params.memberId as string;
    const serviceResponse = await CommunityMemberService.unSuspendMember(req.ctx, memberId);
    return getApiSuccessResponse(res, serviceResponse);
  }
}
