import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  getById: vi.fn(),
  getAll: vi.fn(),
  getUnsettledAmountByInvoice: vi.fn(),
  updateByStatus: vi.fn(),
  getPoolInvoice: vi.fn(),
  getPoolInvoiceIds: vi.fn(),
  getPoolInvoiceIdsByMembers: vi.fn(),
  getCommunityPoolIds: vi.fn(),
  getCommunityMemberIdsByUser: vi.fn(),
  applyInvoiceRemittance: vi.fn(),
  recordTransaction: vi.fn(),
  sanitize: vi.fn((transaction) => transaction),
}));

vi.mock("../db/repo/transaction.repo", () => ({
  TransactionRepo: {
    create: mocks.create,
    getById: mocks.getById,
    getAll: mocks.getAll,
    getUnsettledAmountByInvoice: mocks.getUnsettledAmountByInvoice,
    updateByStatus: mocks.updateByStatus,
  },
}));
vi.mock("../common/transaction.utils", () => ({
  TransactionUtils: {
    sanitize: mocks.sanitize,
    validateTransaction: vi.fn((transaction) => transaction),
  },
}));
vi.mock("@/modules/pool-invoices", () => ({
  PoolInvoiceService: {
    getPoolInvoice: mocks.getPoolInvoice,
    getPoolInvoiceIds: mocks.getPoolInvoiceIds,
    getPoolInvoiceIdsByMembers: mocks.getPoolInvoiceIdsByMembers,
    applyInvoiceRemittance: mocks.applyInvoiceRemittance,
  },
}));
vi.mock("@/modules/community-members", () => ({
  CommunityMemberService: {
    getCommunityMemberIdsByUser: mocks.getCommunityMemberIdsByUser,
  },
}));
vi.mock("@/modules/pools", () => ({
  PoolService: {
    getCommunityPoolIds: mocks.getCommunityPoolIds,
  },
}));
vi.mock("@/modules/bank-account-history", () => ({
  BankAccountHistoryService: {
    recordTransaction: mocks.recordTransaction,
  },
}));
import { TransactionService } from "./transaction.service";

const invoice = {
  id: "invoice-1",
  amount: 100,
  remittedAmount: 20,
  status: "partially_paid",
  currencyCode: "NGN",
  sender: {
    member: { id: "sender-member" },
    accountType: "bank_account",
    bankAccount: { id: "sender-bank-account" },
  },
  receiver: {
    member: { id: "receiver-member" },
    accountType: "bank_account",
    bankAccount: { id: "receiver-bank-account" },
  },
};

describe("TransactionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers an external-account payment awaiting proof using invoice parties", async () => {
    const transaction = { id: "transaction-1", status: "awaiting_proof" };
    mocks.getPoolInvoice.mockResolvedValue({ data: invoice });
    mocks.getUnsettledAmountByInvoice.mockResolvedValue(10);
    mocks.create.mockResolvedValue(transaction);

    const result = await TransactionService.registerTransaction({ communityMember: { id: "sender-member" } } as never, {
      invoice: "invoice-1",
      amount: 70,
    });

    expect(mocks.create).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        invoice: "invoice-1",
        fromBankAccount: "sender-bank-account",
        toBankAccount: "receiver-bank-account",
        amount: 70,
        currencyCode: "NGN",
        status: "awaiting_proof",
      })
    );
    expect(result.data).toBe(transaction);
  });

  it("rounds the remaining invoice balance to two decimal places", async () => {
    mocks.getPoolInvoice.mockResolvedValue({ data: { ...invoice, amount: 0.3, remittedAmount: 0 } });
    mocks.getUnsettledAmountByInvoice.mockResolvedValue(0.2);
    mocks.create.mockResolvedValue({ id: "transaction-1", status: "awaiting_proof" });

    await TransactionService.registerTransaction({ communityMember: { id: "sender-member" } } as never, {
      invoice: "invoice-1",
      amount: 0.1,
    });

    expect(mocks.create).toHaveBeenCalled();
  });

  it("rejects payments that exceed the remaining invoice balance", async () => {
    mocks.getPoolInvoice.mockResolvedValue({ data: invoice });
    mocks.getUnsettledAmountByInvoice.mockResolvedValue(10);

    await expect(
      TransactionService.registerTransaction({ communityMember: { id: "sender-member" } } as never, {
        invoice: "invoice-1",
        amount: 71,
      })
    ).rejects.toThrow("Transaction amount exceeds the invoice's remaining balance");
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("scopes community transaction filters to invoices visible to the current member", async () => {
    mocks.getCommunityPoolIds.mockResolvedValue({ data: ["pool-1"] });
    mocks.getPoolInvoiceIds.mockResolvedValue({ data: ["invoice-1", "invoice-2"] });
    mocks.getAll.mockResolvedValue({ data: [], count: 0, page: 1, limit: 10 });

    await TransactionService.getTransactions({ communityMember: { id: "member-1", role: "member" } } as never, {
      page: 1,
      limit: 10,
      invoiceIds: "invoice-1,invoice-3",
    });

    expect(mocks.getPoolInvoiceIds).toHaveBeenCalledWith(expect.anything(), ["pool-1"], "member-1", undefined);
    expect(mocks.getAll).toHaveBeenCalledWith(expect.anything(), {
      page: 1,
      limit: 10,
      invoiceIds: ["invoice-1"],
    });
  });

  it("scopes community transactions to the requested pool and slot", async () => {
    mocks.getCommunityPoolIds.mockResolvedValue({ data: ["pool-1", "pool-2"] });
    mocks.getPoolInvoiceIds.mockResolvedValue({ data: ["invoice-2"] });
    mocks.getAll.mockResolvedValue({ data: [], count: 0, page: 1, limit: 10 });

    await TransactionService.getTransactions({ communityMember: { id: "admin-1", role: "admin" } } as never, {
      page: 1,
      limit: 10,
      poolId: "pool-2",
      poolSlotId: "slot-2",
    });

    expect(mocks.getPoolInvoiceIds).toHaveBeenCalledWith(expect.anything(), ["pool-2"], undefined, "slot-2");
    expect(mocks.getAll).toHaveBeenCalledWith(expect.anything(), {
      page: 1,
      limit: 10,
      poolId: "pool-2",
      poolSlotId: "slot-2",
      invoiceIds: ["invoice-2"],
    });
  });

  it("returns current-user transactions across all communities", async () => {
    mocks.getCommunityMemberIdsByUser.mockResolvedValue({ data: ["member-1", "member-2"] });
    mocks.getPoolInvoiceIdsByMembers.mockResolvedValue({ data: ["invoice-1", "invoice-2"] });
    mocks.getAll.mockResolvedValue({ data: [], count: 0, page: 1, limit: 10 });

    await TransactionService.getMyTransactions({ loggedInUser: { id: "user-1" } } as never, {
      page: 1,
      limit: 10,
      status: "completed",
    });

    expect(mocks.getCommunityMemberIdsByUser).toHaveBeenCalledWith(expect.anything(), "user-1");
    expect(mocks.getPoolInvoiceIdsByMembers).toHaveBeenCalledWith(expect.anything(), ["member-1", "member-2"]);
    expect(mocks.getAll).toHaveBeenCalledWith(expect.anything(), {
      page: 1,
      limit: 10,
      status: "completed",
      invoiceIds: ["invoice-1", "invoice-2"],
    });
  });

  it("records both account histories after the receiver approves", async () => {
    const transaction = {
      id: "transaction-1",
      invoice: "invoice-1",
      amount: 30,
      status: "pending_approval",
      proof: { fileId: "proof-1", fileName: "receipt.pdf", url: "https://example.com/receipt.pdf" },
    };
    const completed = { ...transaction, status: "completed", completedAt: new Date() };
    mocks.getById.mockResolvedValue(transaction);
    mocks.getPoolInvoice.mockResolvedValue({ data: invoice });
    mocks.updateByStatus.mockResolvedValue(completed);
    mocks.applyInvoiceRemittance.mockResolvedValue({ data: { id: invoice.id } });
    mocks.recordTransaction.mockResolvedValue({ data: [] });

    await TransactionService.decideTransaction({ communityMember: { id: "receiver-member" } } as never, "transaction-1", {
      decision: "approve",
    });

    expect(mocks.applyInvoiceRemittance).toHaveBeenCalledWith(expect.anything(), "invoice-1", "transaction-1", 30);
    expect(mocks.recordTransaction).toHaveBeenCalledWith(expect.anything(), completed);
  });

  it("allows only the invoice receiver to decide", async () => {
    mocks.getById.mockResolvedValue({
      id: "transaction-1",
      invoice: "invoice-1",
      status: "pending_approval",
    });
    mocks.getPoolInvoice.mockResolvedValue({ data: invoice });

    await expect(
      TransactionService.decideTransaction({ communityMember: { id: "sender-member" } } as never, "transaction-1", {
        decision: "reject",
        rejectionReason: "Invalid proof",
      })
    ).rejects.toThrow("Only the invoice receiver can decide this transaction");
    expect(mocks.updateByStatus).not.toHaveBeenCalled();
  });
});
