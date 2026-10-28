import { AppError, StatusCodes } from "@packages/core/res-config";
import type { GetPoolSlotQuery, PoolSlotInput, PoolSlotPaymentInput, ValidatePoolSlotOptions } from "../common/pool-slot.dto";
import * as resp from "../common/pool.res";
import { PoolSlotRepo } from "../db/repo/pool-slot.repo";
import { PoolRepo } from "../db/repo/pool.repo";
import { PoolUtils } from "./pool.utils";
import { getKeys } from "@/config/keys";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { emailService } from "@/lib/helpers/email";
import { BankAccountService } from "@/modules/bank-accounts";
import { CommunityMemberService } from "@/modules/community-members";
import type { PoolDoc } from "@/modules/pools/db/types/pool.types";
import { UserService } from "@/modules/users";

export class PoolSlotService {
  private static async notifyPoolOwners(ctx: Ctx, pool: PoolDoc | null, slotOwnerName: string, status: "approved" | "rejected") {
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);

    const poolOwner = pool.poolMembers.find((poolMember) => poolMember.role === "owner");
    if (!poolOwner) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_owner_not_found);

    const { data: owner } = await UserService.getUserById(ctx, poolOwner.member.user.id);
    if (!owner) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_owner_not_found);

    await emailService.send("PoolSlotStatus", owner.email.address, {
      memberName: slotOwnerName,
      recipientName: owner.firstName || "there",
      recipientType: "pool_owner",
      poolName: pool.name,
      status,
      platformUrl: getKeys().webAppUrl,
    });
  }

  private static async addPoolMemberIfMissing(ctx: Ctx, poolId: string, memberId: string) {
    await PoolRepo.addMemberIfMissing(ctx, poolId, memberId);
  }

  private static async removePoolMemberIfUnused(ctx: Ctx, poolId: string, memberId: string, excludedSlotId: string) {
    const hasOtherSlots = await PoolSlotRepo.hasOtherSlotsForMember(ctx, poolId, memberId, excludedSlotId);
    if (!hasOtherSlots) await PoolRepo.removeMember(ctx, poolId, memberId);
  }

  static async addNewSlot(ctx: Ctx, poolId: string, newSlot: PoolSlotInput) {
    const pool = await PoolRepo.getById(ctx, poolId);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);
    if (!PoolUtils.isCurrentUserPoolOwner(ctx, pool)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.pool_owner_only);
    }

    const poolSlotExist = await PoolSlotRepo.getByPosition(ctx, poolId, newSlot.position);
    if (poolSlotExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_position_exist);

    const { data: slotMember } = await CommunityMemberService.getCommunityMemberById(ctx, newSlot.memberId, {
      isActive: true,
    });
    const isSlotOwner = PoolUtils.isPoolOwner(pool, newSlot.memberId);
    let paymentInfo: { slotAccountType: "bank_account"; bankAccount: string } | undefined;

    if (isSlotOwner) {
      if (!newSlot.slotAccountType || !newSlot.bankAccountId) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_account_required);
      }

      const { data: bankAccount } = await BankAccountService.getBankAccount(ctx, newSlot.bankAccountId);
      if (!bankAccount || bankAccount.user !== slotMember?.user.id) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.slot_bank_account_invalid);
      }

      paymentInfo = { slotAccountType: newSlot.slotAccountType, bankAccount: newSlot.bankAccountId };
    }

    const slot = await PoolSlotRepo.create(ctx, {
      slotOwner: { member: newSlot.memberId, status: isSlotOwner ? "approved" : "draft" },
      position: newSlot.position,
      pool: poolId,
      ...(paymentInfo ? { paymentInfo } : {}),
    });

    return { data: PoolUtils.sanitizePoolSlot(slot), message: resp.pool_created };
  }

  static async getPoolSlots(ctx: Ctx, query: GetPoolSlotQuery) {
    const data = await PoolSlotRepo.getAll(ctx, query);
    return { data };
  }

  static async getPoolSlot(ctx: Ctx, id: string, options?: ValidatePoolSlotOptions) {
    const poolSlot = await PoolSlotRepo.getById(ctx, id);
    if (options?.notFound && !poolSlot) {
      throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    }

    return { data: poolSlot ? PoolUtils.sanitizePoolSlot(poolSlot) : null };
  }

  static async updatePoolSlotMember(ctx: Ctx, poolSlotId: string, slotData: PoolSlotInput) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    const previousMemberId = poolSlot.slotOwner?.member?.id;

    const poolId = PoolUtils.validatePoolIdFromSlot(poolSlot);
    const pool = await PoolRepo.getById(ctx, poolId);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_not_found);
    if (!PoolUtils.isCurrentUserPoolOwner(ctx, pool)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.pool_owner_only);
    }

    const { data: slotMember } = await CommunityMemberService.getCommunityMemberById(ctx, slotData.memberId, {
      isActive: true,
    });
    const isSlotOwner = PoolUtils.isPoolOwner(pool, slotData.memberId);
    let paymentInfo: { slotAccountType: "bank_account"; bankAccount: string } | undefined;

    if (isSlotOwner) {
      if (!slotData.slotAccountType || !slotData.bankAccountId) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_account_required);
      }

      const { data: bankAccount } = await BankAccountService.getBankAccount(ctx, slotData.bankAccountId);
      if (!bankAccount || bankAccount.user !== slotMember?.user.id) {
        throw new AppError(StatusCodes.BAD_REQUEST, resp.slot_bank_account_invalid);
      }

      paymentInfo = { slotAccountType: slotData.slotAccountType, bankAccount: slotData.bankAccountId };
    }

    poolSlot = await PoolSlotRepo.update(
      ctx,
      poolSlotId,
      {
        slotOwner: { member: slotData.memberId, status: isSlotOwner ? "approved" : "draft" },
        ...(paymentInfo ? { paymentInfo } : {}),
      },
      !paymentInfo
    );
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    if (previousMemberId && previousMemberId !== slotData.memberId) {
      await PoolSlotService.removePoolMemberIfUnused(ctx, poolId, previousMemberId, poolSlotId);
    }

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_updated };
  }

  static async confirmPoolSlot(ctx: Ctx, poolSlotId: string) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    if (!poolSlot?.slotOwner?.member) throw new AppError(StatusCodes.BAD_REQUEST, resp.no_slot_owner);

    const poolId = PoolUtils.validatePoolIdFromSlot(poolSlot);
    const pool = await PoolRepo.getById(ctx, poolId);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });

    poolSlot = await PoolSlotRepo.update(ctx, poolSlotId, {
      slotOwner: { member: poolSlot.slotOwner.member.id, status: "pending" },
    });
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    const recipientEmail = poolSlot.slotOwner?.member?.user?.email?.address;
    if (recipientEmail) {
      await emailService.send("PoolSlotStatus", recipientEmail, {
        memberName: poolSlot.slotOwner.member.user.firstName || "there",
        poolName: pool?.name,
        status: "pending",
        platformUrl: getKeys().webAppUrl,
      });
    }

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_updated };
  }

  static async userAcceptSlot(ctx: Ctx, poolSlotId: string, paymentInfo: PoolSlotPaymentInput) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    if (!poolSlot.slotOwner?.member) throw new AppError(StatusCodes.BAD_REQUEST, resp.no_slot_owner);
    if (poolSlot.slotOwner.member.id !== ctx.communityMember?.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.pool_slot_not_owned);
    }
    if (poolSlot.slotOwner.status !== "pending") {
      throw new AppError(StatusCodes.BAD_REQUEST, "Pool slot is not pending approval");
    }

    const { data: bankAccount } = await BankAccountService.getBankAccount(ctx, paymentInfo.bankAccountId);
    if (!bankAccount || bankAccount.user !== poolSlot.slotOwner.member.user.id) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.slot_bank_account_invalid);
    }

    const poolId = PoolUtils.validatePoolIdFromSlot(poolSlot);
    const pool = await PoolRepo.getById(ctx, poolId);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });

    poolSlot = await PoolSlotRepo.update(ctx, poolSlotId, {
      slotOwner: { member: poolSlot.slotOwner.member.id, status: "approved" },
      paymentInfo: {
        slotAccountType: paymentInfo.slotAccountType,
        bankAccount: paymentInfo.bankAccountId,
      },
    });
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    await PoolSlotService.addPoolMemberIfMissing(ctx, poolId, poolSlot.slotOwner.member.id);

    await PoolSlotService.notifyPoolOwners(
      ctx,
      pool,
      `${poolSlot.slotOwner.member.user.firstName} ${poolSlot.slotOwner.member.user.lastName}`.trim(),
      "approved"
    );

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_accepted };
  }

  static async userRejectSlot(ctx: Ctx, poolSlotId: string) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    if (!poolSlot.slotOwner?.member) throw new AppError(StatusCodes.BAD_REQUEST, resp.no_slot_owner);
    if (poolSlot.slotOwner.member.id !== ctx.communityMember?.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, resp.pool_slot_not_owned);
    }
    if (poolSlot.slotOwner.status !== "pending") {
      throw new AppError(StatusCodes.BAD_REQUEST, "Pool slot is not pending approval");
    }

    const poolId = PoolUtils.validatePoolIdFromSlot(poolSlot);
    const pool = await PoolRepo.getById(ctx, poolId);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });

    poolSlot = await PoolSlotRepo.update(ctx, poolSlotId, {
      slotOwner: { member: poolSlot.slotOwner.member.id, status: "rejected" },
    });
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    await PoolSlotService.removePoolMemberIfUnused(ctx, poolId, poolSlot.slotOwner.member.id, poolSlotId);

    const slotOwnerName = `${poolSlot.slotOwner.member.user.firstName} ${poolSlot.slotOwner.member.user.lastName}`.trim();
    await PoolSlotService.notifyPoolOwners(ctx, pool, slotOwnerName, "rejected");

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_rejected };
  }

  static async adminRevokeSlot(ctx: Ctx, poolSlotId: string) {
    let poolSlot = await PoolSlotRepo.getById(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.pool_slot_not_found);
    if (!poolSlot.slotOwner?.member) throw new AppError(StatusCodes.BAD_REQUEST, resp.no_slot_owner);

    const poolId = PoolUtils.validatePoolIdFromSlot(poolSlot);
    const pool = await PoolRepo.getById(ctx, poolId);
    PoolUtils.validatePool(pool, { notFound: true, status: "initiated" });

    poolSlot = await PoolSlotRepo.update(ctx, poolSlotId, {
      slotOwner: { member: poolSlot.slotOwner.member.id, status: "rejected" },
    });
    if (!poolSlot) throw new AppError(StatusCodes.BAD_REQUEST, resp.pool_slot_not_updated);

    await PoolSlotService.removePoolMemberIfUnused(ctx, poolId, poolSlot.slotOwner.member.id, poolSlotId);

    const recipientEmail = poolSlot.slotOwner?.member?.user?.email?.address;
    if (recipientEmail) {
      await emailService.send("PoolSlotStatus", recipientEmail, {
        memberName: poolSlot.slotOwner.member.user.firstName || "there",
        poolName: pool?.name,
        status: "revoked",
        platformUrl: getKeys().webAppUrl,
      });
    }

    return { data: PoolUtils.sanitizePoolSlot(poolSlot), message: resp.pool_slot_revoked };
  }
}
