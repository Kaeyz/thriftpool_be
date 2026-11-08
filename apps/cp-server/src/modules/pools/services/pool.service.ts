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
  static async getCommunityPoolIds(ctx: Ctx): Promise<{ data: string[]; message: string }> {
    const communityId = ctx.community?.id || "";
    const data = await PoolRepo.getIdsByCommunity(ctx, communityId);
    return { data, message: resp.pool_retrieved };
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
    return { data, message: resp.pool_retrieved };
  }

  static async getPool(ctx: Ctx, id: string, options?: ValidatePoolOptions) {
    let pool = await PoolRepo.getByIdInCommunity(ctx, id, ctx.community?.id || "");
    if (options) pool = PoolUtils.validatePool(pool, options);
    return { data: pool ? PoolUtils.sanitizePool(pool) : null, message: resp.pool_retrieved };
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
    const pool = PoolUtils.validatePoolOwnerAction(
      ctx,
      await PoolRepo.getByIdInCommunity(ctx, id, ctx.community?.id || ""),
      "initiated"
    );

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
    const issuedAt = new Date();
    const receiver =
      pool.paymentMode === "direct_payment"
        ? PoolUtils.getSlotAccountInfo(plan.firstPoolSlot)
        : PoolUtils.requirePoolAccountInfo(plan);
    for (const { slot } of plan.scheduledSlots.slice(1)) {
      invoices.push(
        PoolUtils.createContributionInvoice(
          pool,
          slot,
          receiver,
          plan.firstPoolSlot.position,
          issuedAt,
          plan.firstSlotInvoiceDueDate
        )
      );
    }

    if (pool.paymentMode === "via_pool_account") {
      invoices.push(
        PoolUtils.createPoolAccountInvoice(
          pool,
          plan.firstPoolSlot,
          plan.scheduledSlots.length - 1,
          plan.firstPoolSlot.position,
          issuedAt,
          plan.firstPoolSlotPlannedEndDate
        )
      );
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

  static async startNextPool(ctx: Ctx, id: string) {
    const pool = PoolUtils.validatePoolOwnerAction(
      ctx,
      await PoolRepo.getByIdInCommunity(ctx, id, ctx.community?.id || ""),
      "ongoing"
    );

    const activeSlot = await PoolSlotRepo.getActiveByPool(ctx, id);
    if (!activeSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_found);

    const { data: invoices } = await PoolInvoiceService.getPoolInvoicesByTurn(ctx, id, activeSlot.position, pool.noOfSlots + 1);
    if (activeSlot.position < pool.noOfSlots && invoices.length === 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_turn_invoices_not_found);
    }
    const isFullyRemitted = invoices.every((invoice) => invoice.status === "paid");
    if (!isFullyRemitted) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_turn_invoices_unpaid);
    }

    const currentPosition = activeSlot.position;
    const isFinalSlot = currentPosition === pool.noOfSlots;
    let nextSlotId: string | undefined;
    let nextStartDate: number | undefined;
    let nextEndDate: number | undefined;
    if (!isFinalSlot) {
      const poolSlots = await PoolSlotRepo.getAll(
        ctx,
        { poolId: id, page: 1, limit: pool.noOfSlots, sortKey: "position", sortDir: "asc" },
        { paginate: false }
      );
      const nextSlot = poolSlots.data.find((slot) => slot.position === currentPosition + 1);
      if (!nextSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);

      const plannedStartDate = nextSlot.plannedStartDate;
      const plannedEndDate = nextSlot.plannedEndDate;
      if (!plannedStartDate || !plannedEndDate) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slots_incomplete);
      }
      nextSlotId = nextSlot.id;
      nextStartDate = plannedStartDate;
      nextEndDate = plannedEndDate;

      const receiver = PoolUtils.getSlotAccountInfo(nextSlot);
      const futureSlots = poolSlots.data.filter((slot) => slot.position > nextSlot.position);
      const poolAccountInfo = PoolUtils.getPoolAccountInfo(pool);

      const paymentReceiver = pool.paymentMode === "direct_payment" ? receiver : poolAccountInfo;
      if (!paymentReceiver) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_account_required);
      const issuedAt = new Date();
      const dueDate = PoolUtils.getInvoiceDueDate(new Date(plannedEndDate), pool.paymentDeadline);
      const invoicesToCreate: PoolInvoiceCreateInput[] = futureSlots.map((slot) =>
        PoolUtils.createContributionInvoice(pool, slot, paymentReceiver, nextSlot.position, issuedAt, dueDate)
      );

      if (poolAccountInfo && futureSlots.length > 0) {
        invoicesToCreate.push(
          PoolUtils.createPoolAccountInvoice(
            pool,
            nextSlot,
            futureSlots.length,
            nextSlot.position,
            issuedAt,
            new Date(plannedEndDate)
          )
        );
      }

      await PoolInvoiceService.createPoolStartInvoices(ctx, invoicesToCreate);
    }

    const now = Date.now();
    const completedSlot = await PoolSlotRepo.completeActiveCycle(ctx, id, activeSlot.id, now);
    if (!completedSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_cycle_not_advanced);

    if (nextSlotId !== undefined && nextStartDate !== undefined && nextEndDate !== undefined) {
      const activatedSlot = await PoolSlotRepo.activateCycle(ctx, id, nextSlotId, nextStartDate, nextEndDate);
      if (!activatedSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_cycle_not_advanced);
    }

    const updatedPool = await PoolRepo.update(ctx, id, { status: isFinalSlot ? "completed" : "ongoing" });
    if (!updatedPool) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_updated);
    return {
      data: PoolUtils.sanitizePool(updatedPool),
      message: isFinalSlot ? resp.pool_completed : resp.pool_next_turn_started,
    };
  }

  static async deletePool(ctx: Ctx, id: string) {
    const communityId = ctx?.community?.id || "";
    const pool = await PoolRepo.getByIdInCommunity(ctx, id, communityId);
    PoolUtils.validatePool(pool, { status: "initiated" });

    const deleted = await PoolRepo.delete(ctx, id, communityId);
    if (!deleted) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_deleted);
    return { data: null, message: resp.pool_deleted };
  }
}
