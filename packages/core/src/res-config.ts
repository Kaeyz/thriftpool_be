export enum StatusCodes {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INVALID_INPUT = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export const errorTypes = {
  200: "Success",
  400: "Bad Request",
  401: "Unauthenticated",
  403: "Unauthorized",
  404: "Not Found",
  422: "Input Validation Error",
  500: "Internal Server Error",
};

export type StatusCodesType = 200 | 400 | 401 | 403 | 404 | 422 | 500;

export class AppError {
  errorCode: StatusCodesType;
  type: string;
  message: string;
  data: unknown;

  constructor(
    errorCode: StatusCodesType = StatusCodes.INTERNAL_SERVER_ERROR,
    message?: string,
    data: unknown = null,
    type: string = errorTypes[errorCode] || errorTypes[StatusCodes.INTERNAL_SERVER_ERROR]
  ) {
    this.errorCode = errorCode;
    this.type = type;
    this.message = message || errorTypes[errorCode];
    this.data = data;
  }
}

export type AppServiceResponse<T> = {
  message?: string;
  data: T | null;
};
