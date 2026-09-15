import { MediaFile } from "@/lib/definitions";
import { Document } from "mongoose";
import { z } from "zod";
import { MinistrySchema } from "../zod/ministry.zod";

export type IMinistry = {
  name: string;
  key: string;
  logo: MediaFile;
  isSuspended: boolean;
};

export type IMinistryInput = Partial<IMinistry>;

export type MinistryDoc = z.infer<typeof MinistrySchema> & Document;
