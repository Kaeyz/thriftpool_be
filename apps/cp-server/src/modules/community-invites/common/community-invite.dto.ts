import type { z } from "zod";
import type {
  ISCommunityInviteSchema,
  IPCommunityInviteSchema,
  CommunityInvitesQueryInputSchema,
  CommunityInviteInputSchema,
  CommunityInviteStatusSchema,
  CommunityPendingInviteSchema,
} from "../zod/community-invite.zod";

export type ISCommunityInvite = z.infer<typeof ISCommunityInviteSchema>;
export type IPCommunityInvite = z.infer<typeof IPCommunityInviteSchema>;

export type GetCommunityInvitesQuery = z.infer<typeof CommunityInvitesQueryInputSchema>;
export type CommunityInviteInput = z.infer<typeof CommunityInviteInputSchema>;
export type CommunityInviteStatus = z.infer<typeof CommunityInviteStatusSchema>;
export type CommunityPendingInviteInput = z.infer<typeof CommunityPendingInviteSchema>;

export type ValidateCommunityInviteOptions = {
  status?: CommunityInviteStatus;
  notFound?: true;
};
