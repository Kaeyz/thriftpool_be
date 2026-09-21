import { HttpResponseSchema } from "@packages/core/validation";
import { z } from "zod";
import { WebAppAuthSchemas } from "@/modules/auth";
import { WebAppBankAccountSchemas } from "@/modules/bank-accounts";
import { WebAppCommunitySchemas } from "@/modules/communities";
import { WebAppCommunityInviteSchemas } from "@/modules/community-invites";
import { WebAppCommunityMemberSchemas } from "@/modules/community-members";
import { WebAppUserSchemas } from "@/modules/users";
import { WebAppUtilsSchemas } from "@/modules/utils";

const CommonSchema = {
  HttpRes: z.toJSONSchema(HttpResponseSchema(null)),
};

export const webAppSchemas = {
  ...CommonSchema,
  ...WebAppAuthSchemas,
  ...WebAppUserSchemas,
  ...WebAppBankAccountSchemas,
  ...WebAppCommunitySchemas,
  ...WebAppCommunityInviteSchemas,
  ...WebAppCommunityMemberSchemas,
  ...WebAppUtilsSchemas,
};
