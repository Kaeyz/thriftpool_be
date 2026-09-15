import type { Document } from "mongoose";
import type { z } from "zod";
import type { CommunityMemberRole, CommunityMemberStatus } from "../common/community-member.dto";
import type { CommunityMemberSchema } from "../zod/community-member.zod";

export type ICommunityMember = {
  emailAddress: string | null;
  community: string;
  user: string;
  role: CommunityMemberRole;
  status: CommunityMemberStatus;
};

export type ICommunityMemberInput = Partial<ICommunityMember>;

export type CommunityMemberDoc = z.infer<typeof CommunityMemberSchema> & Document;
