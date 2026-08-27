import type { StatusCodes } from "@packages/core/http";
import type { AxiosError, AxiosResponse } from "axios";

export type StatusMap<T extends Partial<Record<StatusCodes, any>>> = {
  [K in StatusCodes]: K extends keyof T ? T[K] : null;
};

type HandlerRequest<T> = Promise<AxiosResponse<{ statusCode: keyof T; message: string; data: T[keyof T] }>>;
type HandlerResponse<T> = Promise<{ statusCode: keyof T; message: string; data: T[keyof T] }>;

export const requestHandler = async <T extends StatusMap<any>>(request: HandlerRequest<T>): HandlerResponse<T> => {
  try {
    const res = await request;
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ statusCode: keyof T; message: string; data: T[keyof T] }>;
    const response = error.response?.data;
    return response ?? { statusCode: 500 as keyof T, message: error.message ?? "Unknown error", data: null };
  }
};
