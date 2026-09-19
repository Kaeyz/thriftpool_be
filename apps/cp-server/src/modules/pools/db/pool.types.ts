import type { CurrencyCode } from "@packages/core/types";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { PoolPaymentInterval, PoolPaymentMode, PoolStatus } from "../common/pool.dto";
import type { PoolSchema } from "../zod/pool.zod";

export type IPool = {
  community: string;
  name: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  paymentInterval: PoolPaymentInterval;
  paymentMode: PoolPaymentMode;
  noOfSlots: number;
  admins: string[];
  status: PoolStatus;
  startDate: number;
  endDate: number;
};

export type IPoolInput = Partial<IPool>;

export type PoolDoc = z.infer<typeof PoolSchema> & Document;
