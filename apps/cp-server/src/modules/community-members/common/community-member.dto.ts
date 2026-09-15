import type { z } from "zod";
import type {
  ISCommunityMemberSchema,
  IPCommunityMemberSchema,
  CommunityMembersQueryInputSchema,
  CommunityMemberInputSchema,
  CommunityMemberRoleSchema,
  InviteCommunityMemberSchema,
  CommunityMemberStatusSchema,
  CommunityPendingInviteSchema,
  CommunityRoleUpdateSchema,
} from "../zod/community-member.zod";

export type ISCommunityMember = z.infer<typeof ISCommunityMemberSchema>;
export type IPCommunityMember = z.infer<typeof IPCommunityMemberSchema>;

export type CommunityMemberRole = z.infer<typeof CommunityMemberRoleSchema>;

export type GetCommunityMembersQuery = z.infer<typeof CommunityMembersQueryInputSchema>;
export type CommunityMemberInput = z.infer<typeof CommunityMemberInputSchema>;
export type InviteMemberInput = z.infer<typeof InviteCommunityMemberSchema>;
export type CommunityMemberStatus = z.infer<typeof CommunityMemberStatusSchema>;
export type CommunityPendingInviteInput = z.infer<typeof CommunityPendingInviteSchema>;
export type CommunityRoleUpdateInput = z.infer<typeof CommunityRoleUpdateSchema>;

export type ValidateCommunityMemberOptions = {
  isActive?: boolean;
};
