import { AppError, StatusCodes } from "@packages/core/res-config";
import type { PoolInput, ValidatePoolOptions } from "../common/pool.dto";
import * as resp from "../common/pool.res";
import { PoolRepo } from "../db/pool.repo";
import { PoolUtils } from "./pool.utils";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { CommunityMemberService } from "@/modules/community-members";

export class PoolService {
  static async createPool(ctx: Ctx, newPool: PoolInput) {
    const userId = ctx?.loggedInUser?.id || "";
    const communityId = ctx?.community?.id || "";

    const pool = await PoolRepo.create(ctx, {
      community: communityId,
      admins: [userId],
      amount: newPool.amount,
      currency: newPool.currency,
      description: newPool.description,
      name: newPool.name,
      noOfSlots: newPool.noOfSlot,
      paymentInterval: newPool.paymentInterval,
      paymentMode: newPool.paymentMode,
      status: "initiated",
    });

    return { data: PoolUtils.sanitize(pool), message: resp.POOL_CREATED };
  }

  static async getPool(ctx: Ctx, id: string, options?: ValidatePoolOptions) {
    let pool = await PoolRepo.getById(ctx, id);
    if (options) pool = PoolUtils.validatePool(pool, options);
    return { data: pool ? PoolUtils.sanitize(pool) : null };
  }

  static async updatePool(ctx: Ctx, id: string, updateData: PoolInput) {
    let pool = await PoolRepo.getById(ctx, id);
    PoolUtils.validatePool(pool, { status: "initiated" });

    pool = await PoolRepo.update(ctx, id, {
      amount: updateData.amount,
      currency: updateData.currency,
      description: updateData.description,
      name: updateData.name,
      noOfSlots: updateData.noOfSlot,
      paymentInterval: updateData.paymentInterval,
      paymentMode: updateData.paymentMode,
    });

    if (!pool) throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_NOT_UPDATED);
    return { data: PoolUtils.sanitize(pool), message: resp.POOL_UPDATED };
  }
}
