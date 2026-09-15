import { HttpResponseSchema } from "@packages/core/validation";
import * as z from "zod";
import {
  UsersQueryResponse,
  ISUserSchema,
  UpdateMyProfileSchema,
  UpdateMyPasswordSchema,
  UpdateMyEmailSchema,
} from "../zod/user.zod";

export const WebAppUserSchemas = {
  Users: z.toJSONSchema(HttpResponseSchema(UsersQueryResponse)),
  User: z.toJSONSchema(HttpResponseSchema(ISUserSchema)),

  UpdateMyProfileInput: z.toJSONSchema(UpdateMyProfileSchema),
  UpdateMyEmailInput: z.toJSONSchema(UpdateMyEmailSchema),
  UpdateMyPasswordInput: z.toJSONSchema(UpdateMyPasswordSchema),
};
