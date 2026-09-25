import type { ISUser } from "../common/user.dto";
import { USER_NOT_FOUND, USER_ACCOUNT_SUSPENDED } from "../common/user.res";
import { UserRepo } from "../db/user.repo";
import { UserUtils } from "./user.utils";
import type { EntityConfig } from "@/lib/file-upload";

const userProfileUseCase = "profile";
const userEntityName = "user";

export const userUploadConfig: EntityConfig<string, string, ISUser> = {
  entityName: userEntityName,
  useCases: [
    {
      useCaseName: userProfileUseCase,
      config: {
        allowedMimeTypes: ["image/jpeg", "image/png"],
        maxSizeMB: 2,
      },
      validate: async (ctx, entityId) => {
        const response = { status: true, message: "Is Valid" };
        const user = await UserRepo.getById(ctx, entityId);
        if (!user) {
          response.status = false;
          response.message = USER_NOT_FOUND;
        }

        if (user && user.isSuspended) {
          response.status = false;
          response.message = USER_ACCOUNT_SUSPENDED;
        }

        return response;
      },
      resolve: async (ctx, entityId, mediaFile): Promise<ISUser> => {
        const user = await UserRepo.update(ctx, entityId, { profilePhoto: mediaFile });
        return UserUtils.sanitize(user!);
      },
    },
  ],
};
