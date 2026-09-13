import { AppError, StatusCodes } from "@packages/core/res-config";
import { formatZodErrors } from "@packages/core/validation";
import type { NextFunction, Response, Request } from "express";
import * as z from "zod";

type Source = "body" | "query" | "params";

type TypedRequest<TSource extends Source, TSchema extends z.ZodSchema<unknown>> = Request & {
  [K in TSource]: z.infer<TSchema>;
};

const getErrorResponse = (source: Source) => {
  if (source === "body") return "Invalid Request Body";
  if (source === "query") return "Invalid Request Query";
  return "Invalid Input";
};

export const validateHttpInput = <TSchema extends z.ZodSchema<unknown>>(schema: TSchema, source: Source) => {
  return (async (req: TypedRequest<typeof source, TSchema>, res: Response, next: NextFunction) => {
    try {
      req[source] = await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const response = new AppError(StatusCodes.INVALID_INPUT, getErrorResponse(source), formatZodErrors(error));
        return res.status(response.errorCode).json(response);
      }
    }
  }) as unknown as NextFunction;
};
