import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  InviteCommunityMemberSchema,
  ISCommunityMemberSchema,
  CommunityMembersQueryResponse,
  CommunityPendingInviteSchema,
  CommunityRoleUpdateSchema,
} from "../zod/community-member.zod";

export const WebAppCommunityMemberSchemas = {
  CommunityMembers: z.toJSONSchema(HttpResponseSchema(CommunityMembersQueryResponse)),
  CommunityMember: z.toJSONSchema(HttpResponseSchema(ISCommunityMemberSchema)),
  InviteMemberInput: z.toJSONSchema(InviteCommunityMemberSchema),
  CommunityPendingInviteInput: z.toJSONSchema(CommunityPendingInviteSchema),
  CommunityRoleUpdateInput: z.toJSONSchema(CommunityRoleUpdateSchema),
};
