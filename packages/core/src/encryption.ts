import { EncryptionKey } from "./types";
import crypto, { CipherGCM, DecipherGCM } from "crypto";

export type EncryptionConfig = {
  secretKey: string;
  salt: string;
}


export class EncryptionHelper {

  private secretKey: string;
  private salt: string;
  private ALGORITHM = "aes-256-gcm";
  private KEY;
  
  constructor(config: EncryptionConfig) {
    this.secretKey = config.secretKey;
    this.salt = config.salt;
    this.KEY = crypto.scryptSync(this.secretKey, this.salt, 32);
  }

  public encryptString (text: string): { value: string; key: EncryptionKey } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, iv) as CipherGCM;
  
    let value = cipher.update(text, "utf8", "hex");
    value += cipher.final("hex");
  
    const authTag = cipher.getAuthTag().toString("hex");
    const key = { iv: iv.toString("hex"), authTag };
  
    return { value, key};
  };
  
  public decryptString (value: string, encryptionKey: EncryptionKey): string {
    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, Buffer.from(encryptionKey.iv, "hex")) as DecipherGCM;
    decipher.setAuthTag(Buffer.from(encryptionKey.authTag, "hex"));

    let decrypted = decipher.update(value, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  };
  
}