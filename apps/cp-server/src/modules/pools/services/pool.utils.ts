import { AppError, StatusCodes } from "@packages/core/res-config";
import type { ISPoolSlot } from "../common/pool-slot.dto";
import type { ISPool, ValidatePoolOptions } from "../common/pool.dto";
import * as resp from "../common/pool.res";
import type { PoolSlotDoc } from "../db/types/pool-slot.types";
import type { PoolDoc } from "../db/types/pool.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class PoolUtils {
  static isCurrentUserPoolOwner(ctx: Ctx, pool: PoolDoc | null): boolean {
    if (!pool || !ctx.communityMember?.id) return false;
    return pool.poolMembers.some(
      (poolMember) => poolMember.role === "owner" && poolMember.member.id === ctx.communityMember?.id
    );
  }

  static isPoolOwner(pool: PoolDoc, memberId: string): boolean {
    return pool.poolMembers.some(
      (poolMember) => poolMember.role === "owner" && poolMember.member.id === memberId
    );
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
