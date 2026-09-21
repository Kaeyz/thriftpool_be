import { FieldSchemas } from "@packages/core/field-schema";
import { PageInputSchema, LimitInputSchema, SortDirectionSchema, CurrencyCodeSchema } from "@packages/core/zod-schemas";
import * as z from "zod";
import { AccountDetailSchema } from "./account-details.zod";

const NairaAccountKeySchema = z.enum(["accountName", "accountNumber", "bankName"]);
const EuroAccountKeySchema = z.enum(["iban", "bic", "accountName"]);

const AccountKeyFieldSchema = NairaAccountKeySchema || EuroAccountKeySchema;

export const AccountInfo = z.object({
  key: AccountKeyFieldSchema,
  value: z.string(),
});

export const BankAccountSchema = z.object({
  id: z.string(),
  user: z.string(),
  accountDetail: AccountDetailSchema,
  accountHash: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const IPBankAccountSchema = BankAccountSchema.pick({ id: true, accountDetail: true, createdAt: true });
export const ISBankAccountSchema = BankAccountSchema.omit({ updatedAt: true, accountHash: true });

export const BankAccountInputSchema = z.object({
  accountDetail: AccountDetailSchema,
});

export const BankAccountQueryResponse = z.object({
  data: z.array(IPBankAccountSchema),
  count: z.int(),
  page: z.int(),
  limit: z.int(),
});

export const BankAccountSortKeySchema = z.enum(["createdAt"]);
export const BankAccountQueryInputSchema = z.object({
  search: FieldSchemas.textSchema("search").optional(),
  page: PageInputSchema,
  limit: LimitInputSchema,
  currencyCode: CurrencyCodeSchema.optional(),
  userId: FieldSchemas.dbIdSchema("userId").optional(),
  sortKey: FieldSchemas.enumSelectSchema("sortKey", BankAccountSortKeySchema).optional(),
  sortDir: FieldSchemas.enumSelectSchema("sortDir", SortDirectionSchema).optional(),
});
