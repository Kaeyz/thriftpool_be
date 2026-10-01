import type { CurrencyCode } from "@packages/core/enums";
import { AppError, StatusCodes } from "@packages/core/res-config";
import type { GetPoolQuery, PoolAccountType, PoolInput, ValidatePoolOptions } from "../common/pool.dto";
import * as resp from "../common/pool.res";
import { PoolSlotRepo } from "../db/repo/pool-slot.repo";
import { PoolRepo } from "../db/repo/pool.repo";
import type { IPoolInput } from "../db/types/pool.types";
import { PoolUtils } from "./pool.utils";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class PoolService {
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
    };
    if (newPool.paymentMode === "via_pool_account") {
      poolInput.poolAccountInfo = {
        accountType: newPool.poolAccountType as PoolAccountType,
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
    let pool = await PoolRepo.getById(ctx, id);
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
    };

    if (updateData.paymentMode === "via_pool_account") {
      poolInput.poolAccountInfo = {
        accountType: updateData.poolAccountType as PoolAccountType,
        bankAccount: updateData?.poolBankAccountId as string,
      };
    }

    pool = await PoolRepo.update(ctx, id, poolInput);

    if (!pool) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_not_updated);
    return { data: PoolUtils.sanitizePool(pool), message: resp.pool_updated };
  }
}
