import * as z from "zod";

export const MediaFileSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  url: z.url(),
});
