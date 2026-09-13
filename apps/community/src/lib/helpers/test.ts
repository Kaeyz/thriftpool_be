import { AppError } from "@packages/core/res-config";
import { expect } from "vitest";

export const expectAppError = async <T>(fn: () => Promise<T>, expectedError: AppError) => {
  try {
    await fn();
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect(error).toEqual(expectedError);
    expect((error as AppError).errorCode).toBe(expectedError.errorCode);
    expect((error as AppError).message).toBe(expectedError.message);
  }
};
