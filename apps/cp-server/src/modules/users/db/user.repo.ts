import { parseSelectFromSchema } from "@packages/core/database";
import { buildPagination, buildSortObject } from "@packages/core/db-query";
import type { GetUsersQuery, IPUser, UserSortKey } from "../common/user.dto";
import { IPUserSchema } from "../zod/user.zod";
import { User } from "./user.model";
import type { IUserInput, UserDoc } from "./user.types";
import type { Ctx } from "@/lib/ctx/ctx.types";

export class UserRepo {
  static async create(ctx: Ctx, data: IUserInput): Promise<UserDoc> {
    return new User(data).save({ session: ctx?.session }) as unknown as UserDoc;
  }

  static getByEmail(ctx: Ctx, emailAddress: string): Promise<UserDoc | null> {
    return User.findOne({ "email.address": emailAddress }, {}, { session: ctx?.session });
  }

  static getById(ctx: Ctx, id: string): Promise<UserDoc | null> {
    return User.findById(id, {}, { session: ctx?.session });
  }

  static getByToken(ctx: Ctx, token: string): Promise<UserDoc | null> {
    return User.findOne({ "token.value": token, "token.expiry": { $gt: Date.now() } }, {}, { session: ctx?.session });
  }

  static async getAll(ctx: Ctx, query: GetUsersQuery) {
    const { search, isSuspended, sortKey, sortDir, userType } = query;

    const fieldPath: Partial<Record<UserSortKey, string>> = {
      emailAddress: "email.address",
      phoneNumber: "phone.number",
    };

    const { skip, page, limit } = buildPagination(query.page, query.limit);
    const sort = buildSortObject(sortKey, sortDir, fieldPath);

    const queryObject: Record<string, unknown> = {};

    if (search) {
      queryObject.$or = [
        { $text: { $search: search } },
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { [fieldPath.emailAddress as string]: new RegExp(search, "i") },
        { [fieldPath.phoneNumber as string]: new RegExp(search, "i") },
      ];
    }

    if (userType) queryObject["userType"] = userType;
    if (isSuspended === "true") queryObject.isSuspended = true;
    if (isSuspended === "false") queryObject.isSuspended = false;

    const countQuery = User.countDocuments(queryObject, { session: ctx?.session });
    const dataQuery = User.find<IPUser>(queryObject, null, { session: ctx?.session })
      .select(parseSelectFromSchema(IPUserSchema))
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count, page, limit };
  }

  static update(ctx: Ctx, id: string, data: IUserInput): Promise<UserDoc | null> {
    return User.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }
}
