import type { CurrencyCode } from "@packages/core/enums";
import type { Document } from "mongoose";
import type { z } from "zod";
import type { PoolAccountType, PoolMemberRole, PoolPaymentInterval, PoolPaymentMode, PoolStatus } from "../../common/pool.dto";
import type { PoolSchema } from "../../zod/pool.zod";

export type IPool = {
  community: string;
  name: string;
  description: string;
  amount: number;
  noOfSlots: number;
  currencyCode: CurrencyCode;
  paymentInterval: PoolPaymentInterval;
  paymentMode: PoolPaymentMode;
  poolAccountInfo: {
    accountType: PoolAccountType;
    bankAccount: string;
  };
  poolMembers: {
    member: string;
    role: PoolMemberRole;
  }[];
  status: PoolStatus;
  startDate: number;
  endDate: number;
};

export type IPoolInput = Partial<IPool>;

export type PoolDoc = z.infer<typeof PoolSchema> & Document;
