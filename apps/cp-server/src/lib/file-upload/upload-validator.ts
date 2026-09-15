import type { MimeType, MulterFile, UploadValidationRules } from "./types";

export function validateUpload(file: MulterFile, rules?: UploadValidationRules) {
  if (!rules) return;

  if (rules.allowedMimeTypes && !rules.allowedMimeTypes.includes(file.mimetype as MimeType)) {
    throw new Error(`Invalid file type: ${file.mimetype}`);
  }

  if (rules.maxSizeMB && file.size > rules.maxSizeMB * 1024 * 1024) {
    throw new Error(`File too large. Max allowed is ${rules.maxSizeMB}MB`);
  }
}
