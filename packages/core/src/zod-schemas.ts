import * as z from "zod";
import { FieldSchemas } from "./field-schema";

export const SortDirectionSchema = z.enum(["asc", "desc"]);
export const PageInputSchema = z.coerce.number().optional();
export const LimitInputSchema = z.coerce.number().optional();

export const EmailSchema = z.object({
  address: z.email(),
  isVerified: z.boolean(),
});

export const EncryptionKeySchema = z.object({
  iv: FieldSchemas.textSchema("iv"),
  authTag: FieldSchemas.textSchema("authTag"),
});

export const TokenSchema = z.object({
  value: FieldSchemas.tokenSchema(),
  key: EncryptionKeySchema.optional(),
  isEncrypted: FieldSchemas.booleanSchema("isEncrypted"),
  expiry: z.number(),
});

export const AddressSchema = FieldSchemas.addressSchema();
export const DateSchema = FieldSchemas.dateSchema();

export const CurrencySchema = z.enum(["NGN", "USD"]);
export const AmountSchema = z.object({
  value: z.int(),
  currency: CurrencySchema,
});

export const PhoneNumberSchema = z.object({
  countryCode: z.string(),
  nationalNumber: z.string(),
  fullPhoneNumber: z.string(),
  isVerified: z.boolean(),
});
