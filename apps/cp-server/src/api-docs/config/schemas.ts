import { HttpResponseSchema } from "@packages/core/validation";
import { z } from "zod";
import { WebAppAuthSchemas } from "@/modules/auth/api/auth.schema";
import { WebAppBankAccountHistorySchemas } from "@/modules/bank-account-history/api/bank-account-history.schema";
import { WebAppBankAccountSchemas } from "@/modules/bank-accounts/api/bank-account.schema";
import { WebAppCommunitySchemas } from "@/modules/communities/api/community.schema";
import { WebAppCommunityInviteSchemas } from "@/modules/community-invites/api/community-invite.schema";
import { WebAppCommunityMemberSchemas } from "@/modules/community-members/api/community-member.schema";
import { WebAppPoolInvoiceSchemas } from "@/modules/pool-invoices/api/pool-invoice.schema";
import { WebAppPoolSchemas } from "@/modules/pools/api/pool.schema";
import { WebAppTransactionSchemas } from "@/modules/transactions/api/transaction.schema";
import { WebAppUserSchemas } from "@/modules/users/api/user.schema";
import { WebAppUtilsSchemas } from "@/modules/utils/api/utils.schema";

const CommonSchema = {
  HttpRes: z.toJSONSchema(HttpResponseSchema(null)),
};

export const webAppSchemas = {
  ...CommonSchema,
  ...WebAppAuthSchemas,
  ...WebAppUserSchemas,
  ...WebAppBankAccountSchemas,
  ...WebAppBankAccountHistorySchemas,
  ...WebAppCommunitySchemas,
  ...WebAppCommunityInviteSchemas,
  ...WebAppCommunityMemberSchemas,
  ...WebAppPoolInvoiceSchemas,
  ...WebAppPoolSchemas,
  ...WebAppUtilsSchemas,
  ...WebAppTransactionSchemas,
};
