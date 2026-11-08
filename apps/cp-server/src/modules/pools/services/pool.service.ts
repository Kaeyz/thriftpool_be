import type { AccountType, CurrencyCode } from "@packages/core/enums";
import { AppError, StatusCodes } from "@packages/core/res-config";
import type { GetPoolQuery, PoolInput, ValidatePoolOptions } from "../common/pool.dto";
import * as resp from "../common/pool.res";
import { PoolSlotRepo } from "../db/repo/pool-slot.repo";
import { PoolRepo } from "../db/repo/pool.repo";
import type { IPoolInput } from "../db/types/pool.types";
import { PoolUtils } from "./pool.utils";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { PoolInvoiceService } from "@/modules/pool-invoices";
import type { PoolInvoiceCreateInput } from "@/modules/pool-invoices/common/pool-invoice.dto";

export class PoolService {
  static async getCommunityPoolIds(ctx: Ctx): Promise<{ data: string[] }> {
    const communityId = ctx.community?.id || "";
    const data = await PoolRepo.getIdsByCommunity(ctx, communityId);
    return { data };
  }

  static async createPool(ctx: Ctx, newPool: PoolInput) {
    const memberId = ctx?.communityMember?.id || "";
    const communityId = ctx?.community?.id || "";

    const poolInput: IPoolInput = {
      community: communityId,
      amount: newPool.amount,
      currencyCode: newPool.currencyCode as CurrencyCode,
      description: newPool.description,
      name: newPool.name,
      noOfSlots: newPool.noOfSlot,
      paymentInterval: newPool.paymentInterval,
      paymentMode: newPool.paymentMode,
      poolMembers: [{ member: memberId, role: "owner" }],
      status: "initiated",
      paymentDeadline: newPool.paymentDeadline,
    };
    if (newPool.paymentMode === "via_pool_account") {
      poolInput.poolAccountInfo = {
        accountType: newPool.poolAccountType as AccountType,
        bankAccount: newPool?.poolBankAccountId as string,
      };
    }

    const pool = await PoolRepo.create(ctx, poolInput);

    return { data: PoolUtils.sanitizePool(pool), message: resp.pool_created };
  }

  static async getPools(ctx: Ctx, query: GetPoolQuery) {
    const data = await PoolRepo.getAll(ctx, query);
    return { data };
  }

  static async getPool(ctx: Ctx, id: string, options?: ValidatePoolOptions) {
    let pool = await PoolRepo.getByIdInCommunity(ctx, id, ctx.community?.id || "");
    if (options) pool = PoolUtils.validatePool(pool, options);
    return { data: pool ? PoolUtils.sanitizePool(pool) : null };
  }

  static async updatePool(ctx: Ctx, id: string, updateData: PoolInput) {
    let pool = await PoolRepo.getById(ctx, id);
    PoolUtils.validatePool(pool, { status: "initiated" });

    const poolInput: IPoolInput = {
      amount: updateData.amount,
      currencyCode: updateData.currencyCode as CurrencyCode,
      description: updateData.description,
      name: updateData.name,
      noOfSlots: updateData.noOfSlot,
      paymentInterval: updateData.paymentInterval,
      paymentMode: updateData.paymentMode,
      paymentDeadline: updateData.paymentDeadline,
    };

    if (updateData.paymentMode === "via_pool_account") {
      poolInput.poolAccountInfo = {
        accountType: updateData.poolAccountType as AccountType,
        bankAccount: updateData?.poolBankAccountId as string,
      };
    }

    pool = await PoolRepo.update(ctx, id, poolInput);

    if (!pool) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_updated);
    return { data: PoolUtils.sanitizePool(pool), message: resp.pool_updated };
  }

  static async startPool(ctx: Ctx, id: string) {
    const pool = await PoolRepo.getById(ctx, id);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);
    if (!PoolUtils.isCurrentUserPoolOwner(ctx, pool)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.pool_owner_only);
    }

    const { data: poolSlots } = await PoolSlotRepo.getAll(
      ctx,
      { poolId: id, page: 1, limit: pool.noOfSlots, sortKey: "position", sortDir: "asc" },
      { paginate: false }
    );
    const plan = PoolUtils.createPoolStartPlan(pool, poolSlots);

    for (const { slot, plannedStartDate, plannedEndDate } of plan.scheduledSlots) {
      const slotUpdate = {
        plannedStartDate: plannedStartDate.getTime(),
        plannedEndDate: plannedEndDate.getTime(),
        ...(slot.id === plan.firstPoolSlot.id
          ? {
              startDate: plannedStartDate.getTime(),
              cycleState: {
                state: "active" as const,
                startDate: plannedStartDate.getTime(),
                endDate: plannedEndDate.getTime(),
              },
            }
          : {}),
      };
      const updatedSlot = await PoolSlotRepo.update(ctx, slot.id, slotUpdate);
      if (!updatedSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);
    }
    const invoices: PoolInvoiceCreateInput[] = [];
    for (const { slot } of plan.scheduledSlots.slice(1)) {
      invoices.push({
        pool: id,
        poolSlot: slot.id,
        turnNumber: plan.firstPoolSlot.position,
        amount: pool.amount,
        currencyCode: pool.currencyCode,
        sender: {
          member: slot.slotOwner.member.id,
          accountType: slot.paymentInfo.accountType,
          bankAccount: slot.paymentInfo.bankAccount.id,
        },
        receiver:
          pool.paymentMode === "direct_payment"
            ? {
                member: plan.firstPoolSlot.slotOwner.member.id,
                accountType: plan.firstPoolSlot.paymentInfo.accountType,
                bankAccount: plan.firstPoolSlot.paymentInfo.bankAccount.id,
              }
            : PoolUtils.requirePoolAccountInfo(plan),
        status: "pending",
        issuedAt: new Date(),
        dueDate: plan.firstSlotInvoiceDueDate,
      });
    }

    if (pool.paymentMode === "via_pool_account") {
      invoices.push({
        pool: id,
        poolSlot: plan.firstPoolSlot.id,
        turnNumber: plan.firstPoolSlot.position,
        amount: pool.amount * (plan.scheduledSlots.length - 1),
        currencyCode: pool.currencyCode,
        sender: PoolUtils.requirePoolAccountInfo(plan),
        receiver: {
          member: plan.firstPoolSlot.slotOwner.member.id,
          accountType: plan.firstPoolSlot.paymentInfo.accountType,
          bankAccount: plan.firstPoolSlot.paymentInfo.bankAccount.id,
        },
        status: "pending",
        issuedAt: new Date(),
        dueDate: plan.firstPoolSlotPlannedEndDate,
      });
    }

    await PoolInvoiceService.createPoolStartInvoices(ctx, invoices);
    const updatedPool = await PoolRepo.update(ctx, id, {
      status: "ongoing",
      startDate: plan.startDate.getTime(),
      endDate: plan.endDate.getTime(),
    });
    if (!updatedPool) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_started);

    return { data: PoolUtils.sanitizePool(updatedPool), message: resp.pool_started };
  }

  static async deletePool(ctx: Ctx, id: string) {
    const communityId = ctx?.community?.id || "";
    const pool = await PoolRepo.getByIdInCommunity(ctx, id, communityId);
    PoolUtils.validatePool(pool, { status: "initiated" });

    const deleted = await PoolRepo.delete(ctx, id, communityId);
    if (!deleted) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_deleted);
    return { message: resp.pool_deleted };
  }
}
