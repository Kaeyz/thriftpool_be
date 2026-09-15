import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { ISCommunitySchema, CommunityQueryResponse, CommunityInputSchema } from "../zod/community.zod";

export const WebAppCommunitySchemas = {
  Communities: z.toJSONSchema(HttpResponseSchema(CommunityQueryResponse)),
  Community: z.toJSONSchema(HttpResponseSchema(ISCommunitySchema)),

  CommunityInput: z.toJSONSchema(CommunityInputSchema),
};
