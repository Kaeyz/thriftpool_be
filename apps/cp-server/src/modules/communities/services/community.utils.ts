import { AppError, StatusCodes } from "@packages/core/res-config";
import type { ISCommunity, ValidateCommunityOptions } from "../common/community.dto";
import * as resp from "../common/community.res";
import type { CommunityDoc } from "../db/community.types";

export class CommunityUtils {
  static sanitize(community: CommunityDoc): ISCommunity {
    const obj = community.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISCommunity;
  }

  static validateCommunity(community: CommunityDoc | null, options: ValidateCommunityOptions = { isSuspended: true }) {
    const { isSuspended } = options;
    if (!community) throw new AppError(StatusCodes.NOT_FOUND, resp.COMMUNITY_NOT_FOUND);
    if (isSuspended && community.isSuspended) throw new AppError(StatusCodes.BAD_REQUEST, resp.COMMUNITY_SUSPENDED);
    return community;
  }
}
