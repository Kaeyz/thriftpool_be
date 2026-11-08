import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getByIdInCommunity: vi.fn(),
  updatePool: vi.fn(),
  getActiveByPool: vi.fn(),
  getAllSlots: vi.fn(),
  completeActiveCycle: vi.fn(),
  activateCycle: vi.fn(),
  getPoolInvoicesByTurn: vi.fn(),
  createPoolStartInvoices: vi.fn(),
  validatePool: vi.fn(),
  validatePoolOwnerAction: vi.fn((_ctx, pool) => pool),
  isCurrentUserPoolOwner: vi.fn(),
  getInvoiceDueDate: vi.fn((date: Date) => date),
  getSlotAccountInfo: vi.fn((slot) => ({
    member: slot.slotOwner.member.id,
    accountType: slot.paymentInfo.accountType,
    bankAccount: slot.paymentInfo.bankAccount.id,
  })),
  getPoolAccountInfo: vi.fn(() => undefined),
  createPoolAccountInvoice: vi.fn((pool, recipientSlot, contributionCount, turnNumber, issuedAt, dueDate) => ({
    pool: pool.id,
    poolSlot: recipientSlot.id,
    turnNumber,
    amount: pool.amount * contributionCount,
    currencyCode: pool.currencyCode,
    sender: { member: "pool-owner", accountType: "bank_account", bankAccount: "pool-bank" },
    receiver: {
      member: recipientSlot.slotOwner.member.id,
      accountType: recipientSlot.paymentInfo.accountType,
      bankAccount: recipientSlot.paymentInfo.bankAccount.id,
    },
    status: "pending",
    issuedAt,
    dueDate,
  })),
  createContributionInvoice: vi.fn((pool, payerSlot, receiver, turnNumber, issuedAt, dueDate) => ({
    pool: pool.id,
    poolSlot: payerSlot.id,
    turnNumber,
    amount: pool.amount,
    currencyCode: pool.currencyCode,
    sender: {
      member: payerSlot.slotOwner.member.id,
      accountType: payerSlot.paymentInfo.accountType,
      bankAccount: payerSlot.paymentInfo.bankAccount.id,
    },
    receiver,
    status: "pending",
    issuedAt,
    dueDate,
  })),
  sanitizePool: vi.fn((pool) => pool),
}));

vi.mock("../db/repo/pool.repo", () => ({
  PoolRepo: {
    getByIdInCommunity: mocks.getByIdInCommunity,
    update: mocks.updatePool,
  },
}));
vi.mock("../db/repo/pool-slot.repo", () => ({
  PoolSlotRepo: {
    getActiveByPool: mocks.getActiveByPool,
    getAll: mocks.getAllSlots,
    completeActiveCycle: mocks.completeActiveCycle,
    activateCycle: mocks.activateCycle,
  },
}));
vi.mock("@/modules/pool-invoices", () => ({
  PoolInvoiceService: {
    getPoolInvoicesByTurn: mocks.getPoolInvoicesByTurn,
    createPoolStartInvoices: mocks.createPoolStartInvoices,
  },
}));
vi.mock("./pool.utils", () => ({
  PoolUtils: {
    validatePool: mocks.validatePool,
    validatePoolOwnerAction: mocks.validatePoolOwnerAction,
    isCurrentUserPoolOwner: mocks.isCurrentUserPoolOwner,
    getInvoiceDueDate: mocks.getInvoiceDueDate,
    getSlotAccountInfo: mocks.getSlotAccountInfo,
    getPoolAccountInfo: mocks.getPoolAccountInfo,
    createContributionInvoice: mocks.createContributionInvoice,
    createPoolAccountInvoice: mocks.createPoolAccountInvoice,
    sanitizePool: mocks.sanitizePool,
  },
}));

import { PoolService } from "./pool.service";

const pool = {
  id: "pool-1",
  status: "ongoing",
  noOfSlots: 3,
  amount: 10,
  currencyCode: "NGN",
  paymentMode: "direct_payment",
  paymentDeadline: { value: 1, unit: "day" },
  poolMembers: [{ member: { id: "owner-member" }, role: "owner" }],
};

const slots = [
  {
    id: "slot-2",
    position: 2,
    slotOwner: { member: { id: "member-2" } },
    paymentInfo: { accountType: "bank_account", bankAccount: { id: "bank-2" } },
    plannedStartDate: 2_000,
    plannedEndDate: 3_000,
  },
  {
    id: "slot-3",
    position: 3,
    slotOwner: { member: { id: "member-3" } },
    paymentInfo: { accountType: "bank_account", bankAccount: { id: "bank-3" } },
    plannedStartDate: 3_000,
    plannedEndDate: 4_000,
  },
];

describe("PoolService.startNextPool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getByIdInCommunity.mockResolvedValue(pool);
    mocks.isCurrentUserPoolOwner.mockReturnValue(true);
    mocks.getActiveByPool.mockResolvedValue({
      id: "slot-1",
      position: 1,
      cycleState: { state: "active" },
    });
    mocks.getAllSlots.mockResolvedValue({ data: slots });
    mocks.getPoolInvoicesByTurn.mockResolvedValue({
      data: [{ id: "invoice-1", amount: 10, remittedAmount: 10, status: "paid" }],
    });
    mocks.createPoolStartInvoices.mockResolvedValue({ data: [] });
    mocks.completeActiveCycle.mockResolvedValue({ id: "slot-1" });
    mocks.activateCycle.mockResolvedValue({ id: "slot-2" });
    mocks.updatePool.mockResolvedValue(pool);
  });

  it("does not advance while any active-turn invoice is unpaid", async () => {
    mocks.getPoolInvoicesByTurn.mockResolvedValue({
      data: [{ id: "invoice-1", amount: 10, remittedAmount: 5, status: "partially_paid" }],
    });

    await expect(
      PoolService.startNextPool({ community: { id: "community-1" }, communityMember: { id: "owner-member" } } as never, "pool-1")
    ).rejects.toThrow("All invoices for the active pool turn must be fully remitted before advancing");

    expect(mocks.completeActiveCycle).not.toHaveBeenCalled();
    expect(mocks.createPoolStartInvoices).not.toHaveBeenCalled();
  });

  it("completes the active slot and issues invoices for the next turn", async () => {
    await PoolService.startNextPool(
      { community: { id: "community-1" }, communityMember: { id: "owner-member" } } as never,
      "pool-1"
    );

    expect(mocks.createPoolStartInvoices).toHaveBeenCalledWith(expect.anything(), [
      expect.objectContaining({
        poolSlot: "slot-3",
        turnNumber: 2,
        sender: {
          member: "member-3",
          accountType: "bank_account",
          bankAccount: "bank-3",
        },
        receiver: {
          member: "member-2",
          accountType: "bank_account",
          bankAccount: "bank-2",
        },
      }),
    ]);
    expect(mocks.completeActiveCycle).toHaveBeenCalledWith(expect.anything(), "pool-1", "slot-1", expect.any(Number));
    expect(mocks.activateCycle).toHaveBeenCalledWith(expect.anything(), "pool-1", "slot-2", 2_000, 3_000);
    expect(mocks.updatePool).toHaveBeenCalledWith(expect.anything(), "pool-1", { status: "ongoing" });
  });

  it("completes the pool when the active slot is the last slot", async () => {
    mocks.getByIdInCommunity.mockResolvedValue({ ...pool, noOfSlots: 1 });
    mocks.getActiveByPool.mockResolvedValue({ id: "slot-1", position: 1, cycleState: { state: "active" } });
    mocks.getPoolInvoicesByTurn.mockResolvedValue({ data: [] });

    await PoolService.startNextPool(
      { community: { id: "community-1" }, communityMember: { id: "owner-member" } } as never,
      "pool-1"
    );

    expect(mocks.getAllSlots).not.toHaveBeenCalled();
    expect(mocks.completeActiveCycle).toHaveBeenCalled();
    expect(mocks.activateCycle).not.toHaveBeenCalled();
    expect(mocks.createPoolStartInvoices).not.toHaveBeenCalled();
    expect(mocks.updatePool).toHaveBeenCalledWith(expect.anything(), "pool-1", { status: "completed" });
  });
});
