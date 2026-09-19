import { AppError, StatusCodes } from "@packages/core/res-config";
import type { CommunityInviteDoc } from "../db/community-invite.types";
import type { ISCommunityInvite, ValidateCommunityInviteOptions } from "./community-invite.dto";
import { COMMUNITY_INVITE_NOT_FOUND, INVALID_INVITE_STATUS } from "./community-invite.res";

export class CommunityInviteUtils {
  static sanitize(communityInvite: CommunityInviteDoc): ISCommunityInvite {
    const obj = communityInvite.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISCommunityInvite;
  }

  static validateCommunityInvite(
    invite: CommunityInviteDoc | null,
    options: ValidateCommunityInviteOptions = { notFound: true }
  ) {
    const { status, notFound } = options;
    if (notFound && !invite) throw new AppError(StatusCodes.NOT_FOUND, COMMUNITY_INVITE_NOT_FOUND);

    if (status && invite && status !== invite.status) {
      const msg = `Invite status must be ${status}`;
      throw new AppError(StatusCodes.BAD_REQUEST, msg);
    }

    return invite;
  }
}
