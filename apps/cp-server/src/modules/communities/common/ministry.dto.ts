import { z } from "zod";
import {
  ISMinistrySchema,
  IPMinistrySchema,
  MinistrySortKeySchema,
  MinistriesQueryInputSchema,
  MinistryInputSchema,
} from "../zod/ministry.zod";

export type ISMinistry = z.infer<typeof ISMinistrySchema>;
export type IPMinistry = z.infer<typeof IPMinistrySchema>;

export type MinistrySortKey = z.infer<typeof MinistrySortKeySchema>;

export type GetMinistriesQuery = z.infer<typeof MinistriesQueryInputSchema>;
export type MinistryInput = z.infer<typeof MinistryInputSchema>;

export type ValidateMinistryOptions = {
  isSuspended?: boolean;
};
