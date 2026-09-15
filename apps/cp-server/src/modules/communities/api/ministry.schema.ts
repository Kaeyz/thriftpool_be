import { HttpResponseSchema } from "@/lib/helpers";
import * as z from "zod";
import { ISMinistrySchema, MinistriesQueryResponse, MinistryInputSchema } from "../zod/ministry.zod";

export const MP_MinistrySchemas = {
  Ministries: z.toJSONSchema(HttpResponseSchema(MinistriesQueryResponse)),
  Ministry: z.toJSONSchema(HttpResponseSchema(ISMinistrySchema)),

  MinistryInput: z.toJSONSchema(MinistryInputSchema),
};
