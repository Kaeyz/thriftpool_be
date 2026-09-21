import { CurrencyCode } from "@packages/core/enums";
import { FieldSchemas } from "@packages/core/field-schema";
import * as z from "zod";

export const EuroAccountSchema = z.object({
  currencyCode: z.literal(CurrencyCode.EUR),
  accountName: FieldSchemas.textSchema("accountName"),
  iban: FieldSchemas.textSchema("iban"),
  bic: FieldSchemas.textSchema("bic"),
});

export const NairaAccountSchema = z.object({
  currencyCode: z.literal(CurrencyCode.NGN),
  accountName: FieldSchemas.textSchema("accountName"),
  bankName: FieldSchemas.textSchema("bankName"),
  accountNumber: FieldSchemas.numberStringSchema("accountNumber", { min: 10, max: 10 }),
});

export const GbpAccountSchema = z.object({
  currencyCode: z.literal(CurrencyCode.GBP),
  accountName: FieldSchemas.textSchema("accountName"),
  sortCode: FieldSchemas.numberStringSchema("sortCode", { min: 6, max: 6 }),
  accountNumber: FieldSchemas.numberStringSchema("accountNumber", { min: 8, max: 8 }),
  iban: FieldSchemas.textSchema("iban").optional(),
  swiftCode: FieldSchemas.textSchema("swiftCode").optional(),
});

export const UsdAccountSchema = z.object({
  currencyCode: z.literal(CurrencyCode.USD),
  accountName: FieldSchemas.textSchema("accountName"),
  routingNumber: FieldSchemas.numberStringSchema("routingNumber", { min: 9, max: 9 }),
  accountNumber: FieldSchemas.numberStringSchema("accountNumber", { min: 4, max: 17 }),
  swiftCode: FieldSchemas.textSchema("swiftCode").optional(),
});

export const AccountDetailSchema = z.discriminatedUnion("currencyCode", [
  EuroAccountSchema,
  NairaAccountSchema,
  GbpAccountSchema,
  UsdAccountSchema,
]);
