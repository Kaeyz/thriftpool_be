import type { Request } from "express";
import type { PassportStatic } from "passport";
import type { JwtFromRequestFunction, StrategyOptions } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { getKeys } from "./keys";
import type { JwtPayload } from "@/modules/auth/common/auth.dto";
import { UserService } from "@/modules/users";
import type { ISUser } from "@/modules/users/common/user.dto";

const tokenExtractor: JwtFromRequestFunction<Request> = (req) => {
  let token: string | null = null;
  if (req && req.headers.atk) token = String(req.headers.atk);
  return token;
};

export const passportConfig = (passport: PassportStatic) => {
  const opts: StrategyOptions = {
    jwtFromRequest: tokenExtractor,
    secretOrKey: getKeys().secretKey,
    passReqToCallback: true,
  };

  passport.use(
    new Strategy(opts, (req: Request, jwt_payload: JwtPayload, done: (arg0: null, arg1: boolean | ISUser) => void) => {
      UserService.getUserById(req.ctx, jwt_payload.id)
        .then((res) => {
          if (!res.data) return done(null, false);
          return done(null, res.data);
        })
        .catch(() => {
          throw new Error("Passport initialization failed");
        });
    })
  );
};
