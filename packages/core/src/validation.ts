import * as z from "zod";
import { StatusCodes } from "./res-config";

export const HttpResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T | null = null) =>
  z.object({
    statusCode: z.number().default(StatusCodes.SUCCESS),
    message: z.string(),
    data: dataSchema || z.null().default(null),
    type: z.string(),
  });

export const formatZodErrors = (error: z.ZodError) => {
  return error.issues.reduce(
    (acc, curr) => {
      const field = curr.path.join(".");
      acc[field] = curr.message;
      return acc;
    },
    {} as Record<string, string>
  );
};

export const transformIds = (val: string | string[]) => {
  return Array.isArray(val) ? val : val.split(",");
};
