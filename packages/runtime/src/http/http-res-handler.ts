import type { AppError, AppServiceResponse } from "@packages/core/res-config";
import { StatusCodes } from "@packages/core/res-config";
import type { Request, Response } from "express";

export const catchHttpError = (fn: (req: Request, res: Response) => Promise<unknown>) => {
  return (req: Request, res: Response) => {
    return fn(req, res).catch((err: AppError) => {
      // eslint-disable-next-line no-console
      if (!err.errorCode) console.log({ err });
      // eslint-disable-next-line no-console
      if (err.errorCode === StatusCodes.INTERNAL_SERVER_ERROR) console.log({ err });
      return res.status(err?.errorCode || 500).json(err);
    });
  };
};

interface HttpRouterResponse<T> extends AppServiceResponse<T> {
  statusCode: StatusCodes;
}

export const successResponse: HttpRouterResponse<object | null> = {
  statusCode: 200,
  data: null,
  message: "Operation Successful",
};

export const getApiSuccessResponse = <T>(res: Response, serviceResponse: T) => {
  const response = { ...successResponse, ...serviceResponse };
  return res.status(response.statusCode).json(response);
};

export const routeNotFound: HttpRouterResponse<null> = {
  statusCode: 404,
  data: null,
  message: "Route not found",
};

export const appIsLive: HttpRouterResponse<null> = {
  statusCode: 200,
  data: null,
  message: "App is live",
};
