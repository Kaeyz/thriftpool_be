import { allMinistryAdmin } from "@/lib/definitions";
import { EntityConfig, registerFileUploadConfig } from "@/lib/file-upload";
import { MinistryRepo } from "../db/ministry.repo";
import { validateMinistryRole } from "./ministry.ctx";
import { ISMinistry } from "./ministry.dto";
import { MINISTRY_NOT_FOUND, MINISTRY_SUSPENDED } from "./ministry.res";
import { MinistryUtils } from "./ministry.utils";

const ministryEntityName = "ministry";
const ministryProfileUseCase = "profile";

const ministryUploadConfig: EntityConfig<string, string, ISMinistry> = {
  entityName: ministryEntityName,
  useCases: [
    {
      useCaseName: ministryProfileUseCase,
      config: {
        allowedMimeTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 2,
      },
      validate: async (ctx, entityId) => {
        const response = { status: true, message: "Is Valid" };

        const ministry = await MinistryRepo.getById(ctx, entityId);
        if (!ministry) {
          response.status = false;
          response.message = MINISTRY_NOT_FOUND;
        }

        ctx.ministry = MinistryUtils.sanitize(ministry!);

        if (ministry && ministry.isSuspended) {
          response.status = false;
          response.message = MINISTRY_SUSPENDED;
        }

        const authorize = await validateMinistryRole(ctx, allMinistryAdmin);
        if (!authorize.isAuthorized) {
          response.status = false;
          response.message = authorize.err?.message || "Unauthorized";
        }

        return response;
      },
      resolve: async (ctx, entityId, mediaFile): Promise<ISMinistry> => {
        const ministry = await MinistryRepo.update(ctx, entityId, { logo: mediaFile });
        return MinistryUtils.sanitize(ministry!);
      },
    },
  ],
};

registerFileUploadConfig(ministryEntityName, ministryUploadConfig);
