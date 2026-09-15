import type { z } from "zod";
import type {
  ISCommunitySchema,
  IPCommunitySchema,
  CommunitySortKeySchema,
  CommunityQueryInputSchema,
  CommunityInputSchema,
  CommunityVisibilitySchema,
} from "../zod/community.zod";

export type ISCommunity = z.infer<typeof ISCommunitySchema>;
export type IPCommunity = z.infer<typeof IPCommunitySchema>;

export type CommunitySortKey = z.infer<typeof CommunitySortKeySchema>;
export type CommunityVisibility = z.infer<typeof CommunityVisibilitySchema>;

export type GetCommunityQuery = z.infer<typeof CommunityQueryInputSchema>;
export type CommunityInput = z.infer<typeof CommunityInputSchema>;

export type ValidateCommunityOptions = {
  isSuspended?: boolean;
};
