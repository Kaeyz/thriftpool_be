import type { StatusCodes } from "@packages/core/http";
import type z from "zod";
import type { OrgInputSchema, OrgSchema } from "./org-zod-schema";
import type { StatusMap } from "@/http/request-handler";

export type OrgDto = z.infer<typeof OrgSchema>;
export type OrgInput = z.infer<typeof OrgInputSchema>;

export type GetOrgResponse = StatusMap<{ [StatusCodes.SUCCESS]: OrgDto }>;
export type CreateOrgResponse = StatusMap<{
  [StatusCodes.SUCCESS]: OrgDto;
  [StatusCodes.INVALID_INPUT]: Partial<Record<keyof OrgInput, string>>;
}>;
