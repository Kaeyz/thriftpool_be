import { EncryptionHelper } from "@packages/core/encryption";
import { getKeys } from "@/config/keys";

const keys = getKeys();
export const encryptionService = new EncryptionHelper({ salt: keys.secretKey, secretKey: keys.secretKey });
