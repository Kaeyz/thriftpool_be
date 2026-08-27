import type * as z from "zod";
//import type { MediaFileSchema } from "../file-upload/file-zod-schemas";
import type {
  AddressSchema,
  AmountSchema,
  CurrencySchema,
  EmailSchema,
  EncryptionKeySchema,
  PhoneNumberSchema,
  PlatformKeySchema,
  PlatformSchema,
  PlatformTypeSchema,
  SortDirectionSchema,
  TokenSchema,
} from "./zod-schemas";

export type AppEnv = "test" | "prod" | "dev";

export type Address = z.infer<typeof AddressSchema>;
//export type MediaFile = z.infer<typeof MediaFileSchema>;
export type MediaFile = {
  fileName: string;
  url: string;
  fileId: string;
}
export type Email = z.infer<typeof EmailSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type EncryptionKey = z.infer<typeof EncryptionKeySchema>;
export type Currency = z.infer<typeof CurrencySchema>;
export type Amount = z.infer<typeof AmountSchema>;
export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
export type SortDirection = z.infer<typeof SortDirectionSchema>;


export type PlatformKey = z.infer<typeof PlatformKeySchema>;
export type PlatformType = z.infer<typeof PlatformTypeSchema>;
export type Platform = z.infer<typeof PlatformSchema>;
