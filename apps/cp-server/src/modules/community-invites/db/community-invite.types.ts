import type { Document } from "mongoose";
import type { z } from "zod";
import type { CommunityInviteStatus } from "../common/community-invite.dto";
import type { CommunityInviteSchema } from "../zod/community-invite.zod";

export type ICommunityInvite = {
  community: string;
  emailAddress: string;
  user: string;
  status: CommunityInviteStatus;
};

export type ICommunityInviteInput = Partial<ICommunityInvite>;

export type CommunityInviteDoc = z.infer<typeof CommunityInviteSchema> & Document;
