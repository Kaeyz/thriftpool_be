import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  ISPoolSlotSchema,
  PoolSlotInputSchema,
  PoolSlotPaymentInputSchema,
  PoolSlotQueryResponse,
} from "../zod/pool-slot.zod";
import { ISPoolSchema, PoolInputSchema, PoolQueryResponse } from "../zod/pool.zod";

export const WebAppPoolSchemas = {
  Pools: z.toJSONSchema(HttpResponseSchema(PoolQueryResponse)),
  Pool: z.toJSONSchema(HttpResponseSchema(ISPoolSchema)),
  PoolInput: z.toJSONSchema(PoolInputSchema),
  PoolSlots: z.toJSONSchema(HttpResponseSchema(PoolSlotQueryResponse)),
  PoolSlot: z.toJSONSchema(HttpResponseSchema(ISPoolSlotSchema)),
  PoolSlotLookup: z.toJSONSchema(HttpResponseSchema(ISPoolSlotSchema.nullable())),
  PoolSlotInput: z.toJSONSchema(PoolSlotInputSchema),
  PoolSlotPaymentInput: z.toJSONSchema(PoolSlotPaymentInputSchema),
};
