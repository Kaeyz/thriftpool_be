import { AppError, StatusCodes } from "@packages/core/res-config";
import type {
  GetPoolInvoicesQuery,
  PoolInvoiceCreateInput,
  PoolInvoiceInput,
  ValidatePoolInvoiceOptions,
} from "../common/pool-invoice.dto";
import * as resp from "../common/pool-invoice.res";
import { PoolInvoiceUtils } from "../common/pool-invoice.utils";
import { PoolInvoiceRepo } from "../db/repo/pool-invoice.repo";
import type { IPoolInvoiceInput } from "../db/types/pool-invoice.types";
import type { Ctx } from "@/lib/ctx/ctx.types";
import type { PoolSlotDoc } from "@/modules/pools/db/types/pool-slot.types";
import type { PoolDoc } from "@/modules/pools/db/types/pool.types";
import { PoolSlotService } from "@/modules/pools/services/pool-slot.service";
import { PoolService } from "@/modules/pools/services/pool.service";

export class PoolInvoiceService {
  private static getInvoiceParties(poolSlot: PoolSlotDoc, pool: PoolDoc): Pick<IPoolInvoiceInput, "sender" | "receiver"> {
    const poolOwner = pool.poolMembers.find((poolMember) => poolMember.role === "owner");
    if (!poolOwner) throw new AppError(StatusCodes.NOT_FOUND, resp.POOL_OWNER_NOT_FOUND);
    if (!poolSlot.slotOwner?.member || !poolSlot.paymentInfo?.bankAccount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_SLOT_ACCOUNT_NOT_FOUND);
    }
    if (!pool.poolAccountInfo?.bankAccount) {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_ACCOUNT_NOT_FOUND);
    }

    return {
      sender: {
        member: poolSlot.slotOwner.member.id,
        accountType: poolSlot.paymentInfo.accountType,
        bankAccount: poolSlot.paymentInfo.bankAccount.id,
      },
      receiver: {
        member: poolOwner.member.id,
        accountType: pool.poolAccountInfo.accountType,
        bankAccount: pool.poolAccountInfo.bankAccount.id,
      },
    };
  }

  static async createInvoiceForPoolSlot(ctx: Ctx, poolSlotId: string) {
    const { data: poolSlot } = await PoolSlotService.getPoolSlotRecord(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.POOL_SLOT_NOT_FOUND);
    if (poolSlot.cycleState?.state !== "active") {
      throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_SLOT_NOT_ACTIVE);
    }

    const { data: pool } = await PoolSlotService.getPoolRecord(ctx, poolSlot.pool.id);
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.POOL_NOT_FOUND);

    const turnNumber = poolSlot.position;
    const invoice = await PoolInvoiceRepo.createForPoolSlotTurn(ctx, poolSlotId, turnNumber, {
      pool: pool.id,
      poolSlot: poolSlotId,
      turnNumber,
      amount: pool.amount,
      currencyCode: pool.currencyCode,
      ...PoolInvoiceService.getInvoiceParties(poolSlot, pool),
      status: "pending",
      issuedAt: new Date(),
      dueDate: new Date(poolSlot.cycleState.endDate),
    });
    if (!invoice) throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_INVOICE_NOT_CREATED);
    return { data: PoolInvoiceUtils.sanitize(invoice), message: resp.POOL_INVOICE_CREATED };
  }

  static async createPoolInvoice(ctx: Ctx, data: PoolInvoiceInput) {
    const { pool, poolSlot } = await PoolInvoiceService.getInvoiceEntities(ctx, data.pool, data.poolSlot);
    const invoice = await PoolInvoiceRepo.create(ctx, {
      ...data,
      ...PoolInvoiceService.getInvoiceParties(poolSlot, pool),
    });
    return { data: PoolInvoiceUtils.sanitize(invoice), message: resp.POOL_INVOICE_CREATED };
  }

  static async createPoolStartInvoices(ctx: Ctx, invoices: PoolInvoiceCreateInput[]) {
    const createdInvoices = [];
    for (const invoice of invoices) {
      const createdInvoice = await PoolInvoiceRepo.createForPoolSlotTurn(ctx, invoice.poolSlot, invoice.turnNumber, invoice);
      if (!createdInvoice) throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_INVOICE_NOT_CREATED);
      createdInvoices.push(createdInvoice);
    }
    return { data: createdInvoices.map(PoolInvoiceUtils.sanitize) };
  }

  static async getPoolInvoice(ctx: Ctx, id: string, options?: ValidatePoolInvoiceOptions) {
    const { data: poolIds } = await PoolService.getCommunityPoolIds(ctx);
    let invoice = await PoolInvoiceRepo.getByIdInPools(ctx, id, poolIds);
    if (options) invoice = PoolInvoiceUtils.validatePoolInvoice(invoice, options);
    return { data: invoice ? PoolInvoiceUtils.sanitize(invoice) : null };
  }

  static async getPoolInvoices(ctx: Ctx, query: GetPoolInvoicesQuery) {
    const { data: poolIds } = await PoolService.getCommunityPoolIds(ctx);
    const data = await PoolInvoiceRepo.getAll(ctx, { ...query, poolIds });
    return { data };
  }

  static async getMyPoolInvoices(ctx: Ctx, query: GetPoolInvoicesQuery) {
    const { data: poolIds } = await PoolService.getCommunityPoolIds(ctx);
    const memberId = ctx.communityMember?.id || "";
    const data = await PoolInvoiceRepo.getAll(ctx, { ...query, poolIds, memberId });
    return { data };
  }

  static async updatePoolInvoice(ctx: Ctx, id: string, data: PoolInvoiceInput) {
    const { pool, poolSlot } = await PoolInvoiceService.getInvoiceEntities(ctx, data.pool, data.poolSlot);
    const invoice = await PoolInvoiceRepo.update(ctx, id, {
      ...data,
      ...PoolInvoiceService.getInvoiceParties(poolSlot, pool),
    });
    if (!invoice) throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_INVOICE_NOT_UPDATED);
    return { data: PoolInvoiceUtils.sanitize(invoice), message: resp.POOL_INVOICE_UPDATED };
  }

  static async deletePoolInvoice(ctx: Ctx, id: string) {
    const invoice = await PoolInvoiceRepo.delete(ctx, id);
    if (!invoice) throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_INVOICE_NOT_DELETED);
    return { message: resp.POOL_INVOICE_DELETED };
  }

  private static async getInvoiceEntities(ctx: Ctx, poolId: string, poolSlotId: string) {
    const { data: poolSlot } = await PoolSlotService.getPoolSlotRecord(ctx, poolSlotId);
    if (!poolSlot) throw new AppError(StatusCodes.NOT_FOUND, resp.POOL_SLOT_NOT_FOUND);
    if (poolSlot.pool.id !== poolId) throw new AppError(StatusCodes.BAD_REQUEST, resp.POOL_SLOT_POOL_MISMATCH);

    const { data: pool } = await PoolSlotService.getPoolRecord(ctx, poolId);
    if (!pool) throw new AppError(StatusCodes.NOT_FOUND, resp.POOL_NOT_FOUND);
    return { pool, poolSlot };
  }
}
