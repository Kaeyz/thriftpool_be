import type { AuthSessionInput } from "../../common/auth.dto";
import AuthSession from "../models/auth-session.model";
import type { AuthSessionDoc } from "../types/auth-session.types";
import type { Ctx } from "@/lib/request-context/config";

export class AuthSessionRepository {
  static async create(ctx: Ctx, data: AuthSessionInput): Promise<AuthSessionDoc> {
    return new AuthSession(data).save({ session: ctx?.session }) as unknown as AuthSessionDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<AuthSessionDoc | null> {
    return AuthSession.findById(id, {}, { session: ctx?.session });
  }

  static getByToken(ctx: Ctx, token: string): Promise<AuthSessionDoc | null> {
    return AuthSession.findOne(
      { "idpToken.value": token, "idpToken.expiry": { $gt: Date.now() } },
      {},
      { session: ctx?.session }
    );
  }

  static getByRefreshToken(ctx: Ctx, token: string): Promise<AuthSessionDoc | null> {
    return AuthSession.findOne(
      { "idpRefreshToken.value": token, "idpRefreshToken.expiry": { $gt: Date.now() } },
      {},
      { session: ctx?.session }
    );
  }

  static update(ctx: Ctx, id: string, data: AuthSessionInput): Promise<AuthSessionDoc | null> {
    return AuthSession.findByIdAndUpdate(id, data, { new: true, session: ctx?.session });
  }

  static delete(ctx: Ctx, id: string): Promise<AuthSessionDoc | null> {
    return AuthSession.findByIdAndDelete(id, { session: ctx?.session });
  }
}
