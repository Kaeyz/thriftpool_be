import { AppError, StatusCodes } from "@packages/core/res-config";
import { generateTokenAndExpiry, hashValue } from "@packages/core/token";
import * as resp from "../common/user.res";
import { UserUtils } from "../common/user.utils";
import { UserRepo } from "../db/user.repo";
import type { Ctx } from "@/lib/ctx/ctx.types";
import { emailService } from "@/lib/helpers/email";
import type { CreateUserInput } from "@/modules/auth/common/auth.dto";

export class UserAccountService {
  static async createUser(ctx: Ctx, newUser: CreateUserInput) {
    let user = await UserRepo.getByEmail(ctx, newUser.emailAddress);
    if (user) throw new AppError(StatusCodes.BAD_REQUEST, resp.USER_WITH_EMAIL_EXIST);

    user = await UserRepo.create(ctx, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: { address: newUser.emailAddress, isVerified: false },
      userType: "user",
      token: generateTokenAndExpiry(),
      password: await hashValue(newUser.password),
    });

    await emailService.send("welcomeEmail", user.email.address, { name: user.firstName, token: user.token.value });

    return { data: UserUtils.sanitize(user), message: resp.USER_CREATED };
  }
}
