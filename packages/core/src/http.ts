import type { Request, Response } from "express";

export enum StatusCodes {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INVALID_INPUT = 406,
  INTERNAL_SERVER_ERROR = 500,
}

const errorTypes = {
  200: "Success",
  400: "Bad Request",
  401: "Unauthenticated",
  403: "Unauthorized",
  404: "Not Found",
  406: "Input Validation Error",
  500: "Internal Server Error",
};

export type StatusCodesType = 200 | 400 | 401 | 403 | 404 | 406 | 500;

export class ApiError {
  statusCode: StatusCodesType;
  type: string;
  message: string;
  data: unknown;

  constructor(
    statusCode: StatusCodesType = StatusCodes.INTERNAL_SERVER_ERROR,
    message: string | null,
    data: unknown = null,
    type: string = errorTypes[statusCode] || errorTypes[StatusCodes.INTERNAL_SERVER_ERROR]
  ) {
    this.statusCode = statusCode;
    this.type = type;
    this.message = message || errorTypes[statusCode];
    this.data = data;
  }
}

export const catchApiError = (fn: (req: Request, res: Response) => Promise<unknown>) => {
  return (req: Request, res: Response) => {
    return fn(req, res).catch((err: ApiError) => {
      return res.status(err.statusCode || 500).json(err);
    });
  };
};

export interface ApiServiceResponse<T> {
  message?: string;
  data: T | null;
}

interface ApiRouterResponse<T> extends ApiServiceResponse<T> {
  statusCode: StatusCodes;
}

export const successResponse: ApiRouterResponse<object | null> = {
  statusCode: 200,
  data: null,
  message: "Operation Successful",
};

export const getApiSuccessResponse = <T>(res: Response, serviceResponse: T) => {
  const response = { ...successResponse, ...serviceResponse };
  return res.status(response.statusCode).json(response);
};

export const routeNotFound: ApiRouterResponse<null> = {
  statusCode: 404,
  data: null,
  message: "Route not found",
};

export const appIsLive: ApiRouterResponse<null> = {
  statusCode: 200,
  data: null,
  message: "App is live",
};
