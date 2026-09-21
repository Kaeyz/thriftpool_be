import type * as z from "zod";
import type {
  AddressSchema,
  AmountSchema,
  EmailSchema,
  EncryptionKeySchema,
  PhoneNumberSchema,
  SortDirectionSchema,
  TokenSchema,
} from "./zod-schemas";

export type Address = z.infer<typeof AddressSchema>;
export type MediaFile = {
  fileName: string;
  url: string;
  fileId: string;
};
export type Email = z.infer<typeof EmailSchema>;
export type Token = z.infer<typeof TokenSchema>;
export type EncryptionKey = z.infer<typeof EncryptionKeySchema>;
export type Amount = z.infer<typeof AmountSchema>;
export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
export type SortDirection = z.infer<typeof SortDirectionSchema>;
