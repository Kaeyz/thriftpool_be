import type { z } from "zod";
import type {
  ISPoolSchema,
  IPPoolSchema,
  PoolSortKeySchema,
  PoolQueryInputSchema,
  PoolInputSchema,
  PoolStatusSchema,
  PoolPaymentIntervalSchema,
  PoolPaymentModeSchema,
} from "../zod/pool.zod";

export type ISPool = z.infer<typeof ISPoolSchema>;
export type IPPool = z.infer<typeof IPPoolSchema>;

export type PoolSortKey = z.infer<typeof PoolSortKeySchema>;
export type PoolStatus = z.infer<typeof PoolStatusSchema>;
export type PoolPaymentInterval = z.infer<typeof PoolPaymentIntervalSchema>;
export type PoolPaymentMode = z.infer<typeof PoolPaymentModeSchema>;

export type GetPoolQuery = z.infer<typeof PoolQueryInputSchema>;
export type PoolInput = z.infer<typeof PoolInputSchema>;

export type ValidatePoolOptions = {
  status?: PoolStatus;
};
