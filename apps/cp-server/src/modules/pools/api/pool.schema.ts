import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import { ISPoolSchema, PoolInputSchema, PoolQueryResponse } from "../zod/pool.zod";

export const WebAppPoolSchemas = {
  Pools: z.toJSONSchema(HttpResponseSchema(PoolQueryResponse)),
  Pool: z.toJSONSchema(HttpResponseSchema(ISPoolSchema)),

  PoolInput: z.toJSONSchema(PoolInputSchema),
};
