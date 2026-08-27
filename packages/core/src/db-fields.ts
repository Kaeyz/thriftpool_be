import type { SchemaTypeOptions } from "mongoose";
import type { Address, Amount, Email, EncryptionKey, MediaFile, PhoneNumber, Token } from "./types";
import { CurrencySchema } from "./zod-schemas";

export type FieldDefinition<T> = {
  [K in keyof T]: SchemaTypeOptions<T[K]>;
};

export const addressField: FieldDefinition<Address> = {
  country: String,
  state: String,
  city: String,
  zipCode: String,
  address: String,
};

export const emailField: FieldDefinition<Email> = {
  address: { type: String, lowercase: true },
  isVerified: { type: Boolean },
};

export const mediaFileField: FieldDefinition<MediaFile> = {
  fileId: String,
  fileName: String,
  url: String,
};

export const encryptionKeyField: FieldDefinition<EncryptionKey> = {
  authTag: { type: String },
  iv: { type: String },
};

export const tokenField: FieldDefinition<Token> = {
  value: { type: String, lowercase: true },
  expiry: { type: Number },
  isEncrypted: { type: Boolean },
  key: encryptionKeyField,
};

export const amountField: FieldDefinition<Amount> = {
  currency: { type: String, enum: CurrencySchema.options },
  value: Number,
};

export const phoneNumberField: FieldDefinition<PhoneNumber> = {
  countryCode: String,
  nationalNumber: String,
  fullPhoneNumber: String,
  isVerified: { type: Boolean },
};
