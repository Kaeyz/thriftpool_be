import { serverApiAuthSchemas, webAppAuthSchemas } from "@/components/auth/api/auth.schema";
import { serverApiOrgSchemas, webAppOrgSchemas } from "@/components/orgs/api/org.schema";
import { webUserApiSchema } from "@/components/users/api/user.schema";

export const webAppApiSchemas = {
  ...webUserApiSchema,
  ...webAppAuthSchemas,
  ...webAppOrgSchemas,
};

export const serverApiSchemas = {
  ...serverApiAuthSchemas,
  ...serverApiOrgSchemas,
};
