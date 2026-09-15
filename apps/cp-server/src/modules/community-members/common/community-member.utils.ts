import { AppError, StatusCodes } from "@packages/core/res-config";
import type { CommunityMemberDoc } from "../db/community-member.types";
import type { ISCommunityMember, ValidateCommunityMemberOptions } from "./community-member.dto";
import { COMMUNITY_MEMBER_NOT_FOUND, MEMBER_IS_INACTIVE } from "./community-member.res";

export class CommunityMemberUtils {
  static sanitize(communityMember: CommunityMemberDoc): ISCommunityMember {
    const obj = communityMember.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISCommunityMember;
  }

  static validateCommunityMember(
    member: CommunityMemberDoc | null,
    options: ValidateCommunityMemberOptions = { isActive: true }
  ) {
    const { isActive } = options;
    if (!member) throw new AppError(StatusCodes.NOT_FOUND, COMMUNITY_MEMBER_NOT_FOUND);
    if (isActive && member.status !== "accepted") throw new AppError(StatusCodes.BAD_REQUEST, MEMBER_IS_INACTIVE);
    return member;
  }
}
