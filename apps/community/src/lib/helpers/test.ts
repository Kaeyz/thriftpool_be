import { ApiError } from "@packages/core/http";
import { expect } from "vitest";

export const expectApiError = async <T>(fn: () => Promise<T>, expectedError: ApiError) => {
  try {
    await fn();
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toEqual(expectedError);
    expect((error as ApiError).statusCode).toBe(expectedError.statusCode);
    expect((error as ApiError).message).toBe(expectedError.message);
  }
};
