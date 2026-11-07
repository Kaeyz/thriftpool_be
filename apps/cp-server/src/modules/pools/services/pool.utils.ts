import { AppError, StatusCodes } from "@packages/core/res-config";
import type { IPPoolSlot, ISPoolSlot } from "../common/pool-slot.dto";
import type { ISPool, ValidatePoolOptions } from "../common/pool.dto";
import * as resp from "../common/pool.res";
import type { PoolSlotDoc } from "../db/types/pool-slot.types";
import type { PoolDoc } from "../db/types/pool.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

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

  static createPoolStartPlan(pool: PoolDoc, poolSlots: IPPoolSlot[]): PoolStartPlan {
    if (
      poolSlots.length !== pool.noOfSlots ||
      poolSlots.some((slot, index) => slot.position !== index + 1 || slot.slotOwner?.status !== "approved")
    ) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
    }

    const firstPoolSlot = poolSlots[0];
    if (!firstPoolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
    if (poolSlots.some((slot) => !slot.slotOwner?.member || !slot.paymentInfo?.bankAccount)) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_payment_account_required);
    }

    const startDate = pool.startDate ? new Date(pool.startDate) : new Date();
    if (Number.isNaN(startDate.getTime())) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_started);
    }

    const scheduledSlots = poolSlots.map((slot, index) => ({
      slot,
      plannedStartDate: PoolUtils.getPlannedDate(startDate, pool.paymentInterval, index),
      plannedEndDate: PoolUtils.getPlannedDate(startDate, pool.paymentInterval, index + 1),
    }));
    const firstSlotSchedule = scheduledSlots[0];
    const finalSlotSchedule = scheduledSlots[scheduledSlots.length - 1];
    if (!firstSlotSchedule || !finalSlotSchedule) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
    }

    let poolAccountInfo: PoolStartPlan["poolAccountInfo"];
    if (pool.paymentMode === "via_pool_account") {
      const poolOwner = pool.poolMembers.find((poolMember) => poolMember.role === "owner");
      if (!poolOwner?.member || !pool.poolAccountInfo?.bankAccount) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_account_required);
      }

      poolAccountInfo = {
        member: poolOwner.member.id,
        accountType: pool.poolAccountInfo.accountType,
        bankAccount: pool.poolAccountInfo.bankAccount.id,
      };
    }

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
