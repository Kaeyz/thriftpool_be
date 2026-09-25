import type { ISCommunity } from "../common/community.dto";
import { COMMUNITY_NOT_FOUND, COMMUNITY_SUSPENDED } from "../common/community.res";
import { CommunityRepo } from "../db/community.repo";
import { validateCommunityRole } from "./community.ctx";
import { CommunityUtils } from "./community.utils";
import { allCommunityAdmin } from "@/lib/definitions/roles";
import type { EntityConfig } from "@/lib/file-upload";

const communityEntityName = "community";
const communityLogoUseCase = "logo";

export const communityUploadConfig: EntityConfig<string, string, ISCommunity> = {
  entityName: communityEntityName,
  useCases: [
    {
      useCaseName: communityLogoUseCase,
      config: {
        allowedMimeTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 2,
      },
      validate: async (ctx, entityId) => {
        const response = { status: true, message: "Is Valid" };

        const community = await CommunityRepo.getById(ctx, entityId);
        if (!community) {
          response.status = false;
          response.message = COMMUNITY_NOT_FOUND;
        }

        ctx.community = CommunityUtils.sanitize(community!);

        if (community && community.isSuspended) {
          response.status = false;
          response.message = COMMUNITY_SUSPENDED;
        }

        const authorize = await validateCommunityRole(ctx, allCommunityAdmin);
        if (!authorize.isAuthorized) {
          response.status = false;
          response.message = authorize.err?.message || "Unauthorized";
        }

        return response;
      },
      resolve: async (ctx, entityId, mediaFile): Promise<ISCommunity> => {
        const community = await CommunityRepo.update(ctx, entityId, { logo: mediaFile });
        return CommunityUtils.sanitize(community!);
      },
    },
  ],
};
