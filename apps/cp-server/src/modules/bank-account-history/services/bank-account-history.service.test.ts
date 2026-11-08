import { CurrencyCode } from "@packages/core/enums";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createIfMissing: vi.fn(),
  sanitize: vi.fn((entry: unknown) => entry),
  getBankAccount: vi.fn(),
}));

vi.mock("../db/repo/bank-account-history.repo", () => ({
  BankAccountHistoryRepo: {
    createIfMissing: mocks.createIfMissing,
  },
}));
vi.mock("../common/bank-account-history.utils", () => ({
  BankAccountHistoryUtils: {
    sanitize: mocks.sanitize,
  },
}));
vi.mock("@/modules/bank-accounts", () => ({
  BankAccountService: {
    getBankAccount: mocks.getBankAccount,
  },
}));

import { BankAccountHistoryService } from "./bank-account-history.service";

describe("BankAccountHistoryService.recordTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createIfMissing.mockImplementation(async (_ctx: unknown, entry: Record<string, unknown>) => ({
      ...entry,
      toJSON: () => entry,
    }));
  });

  it("records a debit for the sender and a credit for the receiver", async () => {
    const result = await BankAccountHistoryService.recordTransaction({} as never, {
      id: "transaction-1",
      invoice: "invoice-1",
      fromBankAccount: "sender-bank-account",
      toBankAccount: "receiver-bank-account",
      amount: 25,
      currencyCode: CurrencyCode.NGN,
      status: "completed",
      reference: "transfer-reference",
      completedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(mocks.createIfMissing).toHaveBeenCalledTimes(2);
    expect(mocks.createIfMissing).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expect.objectContaining({
        bankAccount: "sender-bank-account",
        transaction: "transaction-1",
        type: "outflow",
        amount: 25,
        description: "transfer-reference",
      })
    );
    expect(mocks.createIfMissing).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expect.objectContaining({
        bankAccount: "receiver-bank-account",
        transaction: "transaction-1",
        type: "inflow",
        amount: 25,
        description: "transfer-reference",
      })
    );
    expect(result.data).toHaveLength(2);
  });
});
