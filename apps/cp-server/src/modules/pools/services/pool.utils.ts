import { AppError, StatusCodes } from "@packages/core/res-config";
import type { IPPoolSlot, ISPoolSlot } from "../common/pool-slot.dto";
import type { ISPool, ValidatePoolOptions } from "../common/pool.dto";
import * as resp from "../common/pool.res";
import type { PoolSlotDoc } from "../db/types/pool-slot.types";
import type { PoolDoc } from "../db/types/pool.types";
import type { Ctx } from "@/lib/ctx/ctx.types";
import type { PoolInvoiceCreateInput } from "@/modules/pool-invoices/common/pool-invoice.dto";

type ScheduledPoolSlot = {
  slot: IPPoolSlot;
  plannedStartDate: Date;
  plannedEndDate: Date;
};

type PoolStartPlan = {
  scheduledSlots: ScheduledPoolSlot[];
  firstPoolSlot: IPPoolSlot;
  firstPoolSlotPlannedEndDate: Date;
  firstSlotInvoiceDueDate: Date;
  startDate: Date;
  endDate: Date;
  poolAccountInfo?: {
    member: string;
    accountType: PoolDoc["poolAccountInfo"]["accountType"];
    bankAccount: string;
  };
};

export class PoolUtils {
  static validatePoolOwnerAction(ctx: Ctx, pool: PoolDoc | null, status: PoolDoc["status"]): PoolDoc {
    PoolUtils.validatePool(pool, { notFound: true, status });
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);
    if (!PoolUtils.isCurrentUserPoolOwner(ctx, pool)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.pool_owner_only);
    }
    return pool;
  }

  static getSlotAccountInfo(slot: IPPoolSlot): PoolInvoiceCreateInput["sender"] {
    if (!slot.slotOwner?.member || !slot.paymentInfo?.bankAccount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_payment_account_required);
    }
    return {
      member: slot.slotOwner.member.id,
      accountType: slot.paymentInfo.accountType,
      bankAccount: slot.paymentInfo.bankAccount.id,
    };
  }

  static getPoolAccountInfo(pool: PoolDoc): PoolStartPlan["poolAccountInfo"] {
    if (pool.paymentMode !== "via_pool_account") return undefined;
    const poolOwner = pool.poolMembers.find((poolMember) => poolMember.role === "owner");
    if (!poolOwner?.member || !pool.poolAccountInfo?.bankAccount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_account_required);
    }
    return {
      member: poolOwner.member.id,
      accountType: pool.poolAccountInfo.accountType,
      bankAccount: pool.poolAccountInfo.bankAccount.id,
    };
  }

  static createContributionInvoice(
    pool: PoolDoc,
    payerSlot: IPPoolSlot,
    receiver: PoolInvoiceCreateInput["receiver"],
    turnNumber: number,
    issuedAt: Date,
    dueDate: Date
  ): PoolInvoiceCreateInput {
    return {
      pool: pool.id,
      poolSlot: payerSlot.id,
      turnNumber,
      amount: pool.amount,
      currencyCode: pool.currencyCode,
      sender: PoolUtils.getSlotAccountInfo(payerSlot),
      receiver,
      status: "pending",
      issuedAt,
      dueDate,
    };
  }

  static createPoolAccountInvoice(
    pool: PoolDoc,
    recipientSlot: IPPoolSlot,
    contributionCount: number,
    turnNumber: number,
    issuedAt: Date,
    dueDate: Date
  ): PoolInvoiceCreateInput {
    const poolAccountInfo = PoolUtils.getPoolAccountInfo(pool);
    if (!poolAccountInfo) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_account_required);
    return {
      pool: pool.id,
      poolSlot: recipientSlot.id,
      turnNumber,
      amount: pool.amount * contributionCount,
      currencyCode: pool.currencyCode,
      sender: poolAccountInfo,
      receiver: PoolUtils.getSlotAccountInfo(recipientSlot),
      status: "pending",
      issuedAt,
      dueDate,
    };
  }

  private static getPlannedDate(startDate: Date, interval: PoolDoc["paymentInterval"], period: number): Date {
    if (interval === "weekly") {
      const date = new Date(startDate);
      date.setUTCDate(date.getUTCDate() + 7 * period);
      return date;
    }

    const monthIndex = startDate.getUTCMonth() + period;
    const year = startDate.getUTCFullYear() + Math.floor(monthIndex / 12);
    const month = monthIndex % 12;
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const date = new Date(startDate);
    date.setUTCDate(1);
    date.setUTCFullYear(year, month, Math.min(startDate.getUTCDate(), lastDayOfMonth));
    return date;
  }

  private static subtractPaymentDeadline(date: Date, deadline: PoolDoc["paymentDeadline"]): Date {
    const dueDate = new Date(date);
    const days = deadline.value * (deadline.unit === "week" ? 7 : 1);
    dueDate.setUTCDate(dueDate.getUTCDate() - days);
    return dueDate;
  }

  static getInvoiceDueDate(date: Date, deadline: PoolDoc["paymentDeadline"]): Date {
    return PoolUtils.subtractPaymentDeadline(date, deadline);
  }

  static createPoolStartPlan(pool: PoolDoc, poolSlots: IPPoolSlot[]): PoolStartPlan {
    const positions = new Set(poolSlots.map((slot) => slot.position));
    if (
      poolSlots.length !== pool.noOfSlots ||
      positions.size !== pool.noOfSlots ||
      poolSlots.some(
        (slot) =>
          !Number.isInteger(slot.position) ||
          slot.position < 1 ||
          slot.position > pool.noOfSlots ||
          slot.slotOwner?.status !== "approved"
      )
    ) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
    }

    const firstPoolSlot = poolSlots.find((slot) => slot.position === 1);
    if (!firstPoolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
    if (poolSlots.some((slot) => !slot.slotOwner?.member || !slot.paymentInfo?.bankAccount)) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_payment_account_required);
    }

    const startDate = pool.startDate ? new Date(pool.startDate) : new Date();
    if (Number.isNaN(startDate.getTime())) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_started);
    }

    const scheduledSlots = poolSlots
      .map((slot) => ({
        slot,
        plannedStartDate: PoolUtils.getPlannedDate(startDate, pool.paymentInterval, slot.position - 1),
        plannedEndDate: PoolUtils.getPlannedDate(startDate, pool.paymentInterval, slot.position),
      }))
      .sort((a, b) => a.slot.position - b.slot.position);
    const firstSlotSchedule = scheduledSlots.find(({ slot }) => slot.position === 1);
    const finalSlotSchedule = scheduledSlots.find(({ slot }) => slot.position === pool.noOfSlots);
    if (!firstSlotSchedule || !finalSlotSchedule) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
    }

    const poolAccountInfo = PoolUtils.getPoolAccountInfo(pool);

    return {
      scheduledSlots,
      firstPoolSlot,
      firstPoolSlotPlannedEndDate: firstSlotSchedule.plannedEndDate,
      firstSlotInvoiceDueDate: PoolUtils.subtractPaymentDeadline(firstSlotSchedule.plannedEndDate, pool.paymentDeadline),
      startDate,
      endDate: finalSlotSchedule.plannedEndDate,
      ...(poolAccountInfo ? { poolAccountInfo } : {}),
    };
  }

  static requirePoolAccountInfo(plan: PoolStartPlan): NonNullable<PoolStartPlan["poolAccountInfo"]> {
    if (!plan.poolAccountInfo) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_account_required);
    return plan.poolAccountInfo;
  }

  static isCurrentUserPoolOwner(ctx: Ctx, pool: PoolDoc | null): boolean {
    if (!pool || !ctx.communityMember?.id) return false;
    return pool.poolMembers.some((poolMember) => poolMember.role === "owner" && poolMember.member.id === ctx.communityMember?.id);
  }

  static isPoolOwner(pool: PoolDoc, memberId: string): boolean {
    return pool.poolMembers.some((poolMember) => poolMember.role === "owner" && poolMember.member.id === memberId);
  }

  static validatePoolIdFromSlot(poolSlot: PoolSlotDoc | null): string {
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    const poolId = poolSlot.pool?.id ?? null;
    if (!poolId) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);
    return poolId;
  }

  static sanitizePool(pool: PoolDoc): ISPool {
    const obj = pool.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISPool;
  }

  static sanitizePoolSlot(poolSlot: PoolSlotDoc): ISPoolSlot {
    const obj = poolSlot.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISPoolSlot;
  }

  static validatePool(pool: PoolDoc | null, options: ValidatePoolOptions) {
    const { status, notFound } = options;

    if (notFound && !pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);

    if (status) {
      if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);
      if (pool.status !== status) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Pool must be $${status} status`);
      }
    }
    return pool;
  }
}
