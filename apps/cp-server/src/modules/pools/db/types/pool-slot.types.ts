import type { AccountType } from "@packages/core/enums";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { PoolSlotOwnerStatus, SlotCycleState } from "../../common/pool-slot.dto";
import type { PoolSlotSchema } from "../../zod/pool-slot.zod";

export type IPoolSlot = {
  pool: string;
  slotOwner: {
    member: string;
    status: PoolSlotOwnerStatus;
  };
  cycleState: SlotCycleState;
  paymentInfo: {
    accountType: AccountType;
    bankAccount: string;
  };
  position: number;
};

export type IPoolSlotInput = Partial<IPoolSlot>;

export type PoolSlotDoc = z.infer<typeof PoolSlotSchema> & Document;
