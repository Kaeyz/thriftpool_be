import { WebAppAuthSchemas } from "@/modules/auth";
import { WebAppUserSchemas } from "@/modules/users";

export const webAppSchemas = {
  ...WebAppAuthSchemas,
  ...WebAppUserSchemas,
};
