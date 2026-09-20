import type { z } from "zod";
import type {
  ISPoolSlotSchema,
  IPPoolSlotSchema,
  PoolSlotSortKeySchema,
  PoolSlotInputSchema,
  PoolSlotStatusSchema,
  PoolSlotQueryInputSchema,
} from "../zod/pool-slot.zod";

export type ISPoolSlot = z.infer<typeof ISPoolSlotSchema>;
export type IPPoolSlot = z.infer<typeof IPPoolSlotSchema>;

export type PoolSlotSortKey = z.infer<typeof PoolSlotSortKeySchema>;
export type PoolSlotStatus = z.infer<typeof PoolSlotStatusSchema>;

export type GetPoolSlotQuery = z.infer<typeof PoolSlotQueryInputSchema>;
export type PoolSlotInput = z.infer<typeof PoolSlotInputSchema>;

export type ValidatePoolSlotOptions = {
  status?: PoolSlotStatus;
};
