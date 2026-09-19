import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  CommunityInviteInputSchema,
  ISCommunityInviteSchema,
  CommunityInvitesQueryResponse,
  CommunityPendingInviteSchema,
} from "../zod/community-invite.zod";

export const WebAppCommunityInviteSchemas = {
  CommunityInvites: z.toJSONSchema(HttpResponseSchema(CommunityInvitesQueryResponse)),
  CommunityInvite: z.toJSONSchema(HttpResponseSchema(ISCommunityInviteSchema)),
  CommunityInviteInput: z.toJSONSchema(CommunityInviteInputSchema),
  CommunityPendingInviteInput: z.toJSONSchema(CommunityPendingInviteSchema),
};
