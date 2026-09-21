import type { Document } from "mongoose";
import type { z } from "zod";
import type { AccountDetail } from "../common/bank-account.dto";
import type { BankAccountSchema } from "../zod/bank-account.zod";

export type IBankAccount = {
  user: string;
  accountDetail: AccountDetail;
  accountHash: string;
};

export type IBankAccountInput = Partial<IBankAccount>;

export type BankAccountDoc = z.infer<typeof BankAccountSchema> & Document;
