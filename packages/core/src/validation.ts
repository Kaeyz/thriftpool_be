import { ApiError, StatusCodes } from "./http";
import * as z from "zod";
import type { NextFunction, Response, Request } from "express";

export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema?: T) =>
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

type Source = "body" | "query" | "params";

type TypedRequest<TSource extends Source, TSchema extends z.ZodSchema<unknown>> = Request & {
  [K in TSource]: z.infer<TSchema>;
};

const getErrorResponse = (source: Source) => {
  if (source === "body") return "Invalid Request Body";
  if (source === "query") return "Invalid Request Query";
  return "Invalid Input";
};

export const validateRequestInput = <TSchema extends z.ZodSchema<unknown>>(schema: TSchema, source: Source) => {
  return (async (req: TypedRequest<typeof source, TSchema>, res: Response, next: NextFunction) => {
    try {
      req[source] = await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const response = new ApiError(StatusCodes.INVALID_INPUT, getErrorResponse(source), formatZodErrors(error));
        return res.status(response.statusCode).json(response);
      }
    }
  }) as unknown as NextFunction;
};
