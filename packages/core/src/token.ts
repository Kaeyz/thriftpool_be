import { compare, genSalt, hash } from "bcryptjs";
import type { Token } from "./types";

export const generateTokenAndExpiry = (length = 6, expiresInHours: number = 1): Token => {
  const min = Number(Array.from({ length }, (_, i) => (i === 0 ? 1 : 0)).join(""));
  const max = Number(Array.from({ length }, () => 9).join(""));
  const expiresInMs = expiresInHours * 60 * 60 * 1000;
  return {
    value: String(Math.floor(Math.random() * (max - min + 1)) + min),
    isEncrypted: false,
    expiry: Date.now() + expiresInMs,
  };
};

export const hashValue = (value: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    genSalt(10, (err, salt) => {
      if (err) return reject(err);
      hash(value, salt as string, (err, hash) => {
        if (err) return reject(err);
        return resolve(hash as string);
      });
    });
  });
};

export const compareHash = (hash: string, value: string): Promise<boolean | Error> => {
  return new Promise((resolve, reject) => {
    compare(value, hash)
      .then((isMatch: boolean) => resolve(isMatch))
      .catch((err: Error) => reject(err));
  });
};
