import type { MediaFile } from "@packages/core/types";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { CommunityVisibility } from "../common/community.dto";
import type { CommunitySchema } from "../zod/community.zod";

export type ICommunity = {
  name: string;
  description: string;
  key: string;
  logo: MediaFile;
  isSuspended: boolean;
  visibility: CommunityVisibility;
};

export type ICommunityInput = Partial<ICommunity>;

export type CommunityDoc = z.infer<typeof CommunitySchema> & Document;
