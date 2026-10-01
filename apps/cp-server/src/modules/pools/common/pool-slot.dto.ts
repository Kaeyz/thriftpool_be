import type { z } from "zod";
import type {
  ISPoolSlotSchema,
  IPPoolSlotSchema,
  PoolSlotSortKeySchema,
  PoolSlotInputSchema,
  PoolSlotQueryInputSchema,
  PoolSlotOwnerSchema,
  SlotCycleStateSchema,
  PoolSlotPaymentInfoSchema,
  PoolSlotOwnerStatusSchema,
} from "../zod/pool-slot.zod";

export type ISPoolSlot = z.infer<typeof ISPoolSlotSchema>;
export type IPPoolSlot = z.infer<typeof IPPoolSlotSchema>;

export type PoolSlotSortKey = z.infer<typeof PoolSlotSortKeySchema>;
export type PoolSlotOwner = z.infer<typeof PoolSlotOwnerSchema>;
export type PoolSlotOwnerStatus = z.infer<typeof PoolSlotOwnerStatusSchema>;
export type SlotCycleState = z.infer<typeof SlotCycleStateSchema>;
export type PoolSlotPaymentInfo = z.infer<typeof PoolSlotPaymentInfoSchema>;

export type GetPoolSlotQuery = z.infer<typeof PoolSlotQueryInputSchema>;
export type PoolSlotInput = z.infer<typeof PoolSlotInputSchema>;

export type ValidatePoolSlotOptions = {
  notFound?: true;
};
