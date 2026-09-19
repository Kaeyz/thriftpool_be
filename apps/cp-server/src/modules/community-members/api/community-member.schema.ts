import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { ISCommunityMemberSchema, CommunityMembersQueryResponse, CommunityRoleUpdateSchema } from "../zod/community-member.zod";

export const WebAppCommunityMemberSchemas = {
  CommunityMembers: z.toJSONSchema(HttpResponseSchema(CommunityMembersQueryResponse)),
  CommunityMember: z.toJSONSchema(HttpResponseSchema(ISCommunityMemberSchema)),
  CommunityRoleUpdateInput: z.toJSONSchema(CommunityRoleUpdateSchema),
};
