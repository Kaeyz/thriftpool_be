import { AppError, StatusCodes } from "@packages/core/res-config";
import type { PoolSlotInput } from "../common/pool-slot.dto";
import * as resp from "../common/pool.res";
import { PoolSlotRepo } from "../db/repo/pool-slot.repo";
import { PoolRepo } from "../db/repo/pool.repo";
import { PoolUtils } from "./pool.utils";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { CommunityMemberService } from "@/modules/community-members";

export class PoolSlotService {
  static async addNewSlot(ctx: Ctx, poolId: string, newSlot: PoolSlotInput) {
    const poolSlotExist = await PoolSlotRepo.getByPosition(ctx, poolId, newSlot.position);
    if (poolSlotExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_position_exist);

    await CommunityMemberService.getCommunityMemberById(ctx, newSlot.memberId, { isActive: true });

    const slot = await PoolSlotRepo.create(ctx, {
      slotOwner: { member: newSlot.memberId, status: "draft" },
      position: newSlot.position,
      pool: poolId,
    });

    return { data: PoolUtils.sanitizePoolSlot(slot), message: resp.pool_created };
  }

  static async updatePoolSlotMember(ctx: Ctx, poolSlotId: string, slotData: PoolSlotInput) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);

    const pool = await PoolRepo.getById(ctx, poolSlot.id);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });

    await CommunityMemberService.getCommunityMemberById(ctx, slotData.memberId, { isActive: true });
    poolSlot = await PoolSlotRepo.update(ctx, poolSlotId, { slotOwner: { member: slotData.memberId, status: "draft" } });
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_updated };
  }

  static async confirmPoolSlot(ctx: Ctx, poolSlotId: string) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    if (!poolSlot?.slotOwner?.member) throw new AppError(StatusCodes.BAD_REQUEST, resp.no_slot_owner);

    const pool = await PoolRepo.getById(ctx, poolSlot.id);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });

    poolSlot = await PoolSlotRepo.update(ctx, poolSlotId, {
      slotOwner: { member: poolSlot.slotOwner.member.id, status: "pending" },
    });
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    // Send email.

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_updated };
  }
}
