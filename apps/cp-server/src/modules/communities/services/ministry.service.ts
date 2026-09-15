import { AppError, StatusCodes } from "@/config/response-config";
import { Ctx } from "@/lib/ctx";
import { MinistryMemberService } from "@/modules/ministry-members";
import { GetMinistriesQuery, IPMinistry, MinistryInput, ValidateMinistryOptions } from "../common/ministry.dto";
import * as resp from "../common/ministry.res";
import { MinistryUtils } from "../common/ministry.utils";
import { MinistryRepo } from "../db/ministry.repo";
import { MinistryDoc } from "../db/ministry.types";

export class MinistryService {
  static #validateMinistry(ministry: MinistryDoc | null, options: ValidateMinistryOptions = { isSuspended: true }) {
    const { isSuspended } = options;
    if (!ministry) throw new AppError(StatusCodes.NOT_FOUND, resp.MINISTRY_NOT_FOUND);
    if (isSuspended && ministry.isSuspended) throw new AppError(StatusCodes.BAD_REQUEST, resp.MINISTRY_SUSPENDED);
    return ministry;
  }

  static async createMinistry(ctx: Ctx, newMinistry: MinistryInput) {
    const userId = ctx?.loggedInUser?.id || "";

    const ministryExist = await MinistryRepo.getByKey(ctx, newMinistry.key);
    if (ministryExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.MINISTRY_WITH_KEY_EXIST);

    const ministry = await MinistryRepo.create(ctx, { name: newMinistry.name, key: newMinistry.key });

    await MinistryMemberService.createMinistryMember(ctx, { userId, ministryId: ministry.id, role: "owner" });
    return { data: MinistryUtils.sanitize(ministry), message: resp.MINISTRY_CREATED };
  }

  static async getMinistry(ctx: Ctx, id: string, options?: ValidateMinistryOptions) {
    let ministry = await MinistryRepo.getById(ctx, id);
    if (options) ministry = this.#validateMinistry(ministry, options);
    return { data: ministry ? MinistryUtils.sanitize(ministry) : null };
  }

  static async getMinistryByKey(ctx: Ctx, key: string, options?: ValidateMinistryOptions) {
    let ministry = await MinistryRepo.getByKey(ctx, key);
    if (options) ministry = this.#validateMinistry(ministry, options);
    return { data: ministry ? MinistryUtils.sanitize(ministry) : null };
  }

  static async updateMinistry(ctx: Ctx, ministryId: string, updateData: MinistryInput) {
    let ministry = await MinistryRepo.getById(ctx, ministryId);
    this.#validateMinistry(ministry);

    if (updateData?.key !== ministry?.key) {
      const ministryExist = await MinistryRepo.getByKey(ctx, updateData.key);
      if (ministryExist) throw new AppError(StatusCodes.BAD_REQUEST, resp.MINISTRY_WITH_KEY_EXIST);
    }

    ministry = await MinistryRepo.update(ctx, ministryId, { name: updateData.name, key: updateData.key });

    if (!ministry) throw new AppError(StatusCodes.BAD_REQUEST, resp.MINISTRY_NOT_UPDATED);
    return { data: MinistryUtils.sanitize(ministry), message: resp.MINISTRY_UPDATED };
  }

  static async getMyMinistries(ctx: Ctx, query: GetMinistriesQuery) {
    const userId = ctx?.loggedInUser?.id || "";

    const { data: ministryMembers } = await MinistryMemberService.getMinistryMembers(ctx, {
      limit: query.limit,
      page: query.page,
      status: "accepted",
      userId,
    });

    let queryResponse = {
      data: [] as IPMinistry[],
      limit: ministryMembers.limit,
      count: ministryMembers.count,
      page: ministryMembers.page,
    };

    if (ministryMembers.count > 0) {
      const ministryIds = ministryMembers.data.map((v) => v.ministry.id);
      const ministries = await MinistryRepo.getAll(ctx, {
        search: query.search,
        ministryIds,
        limit: ministryIds.length,
        isSuspended: "false",
      });

      queryResponse = { ...queryResponse, data: ministries.data };
    }

    return { data: queryResponse };
  }
}
