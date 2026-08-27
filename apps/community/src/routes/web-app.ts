import { setupRouteAuth, setupDocs } from "@packages/core/route-config";
import type { Router } from "express";
import docsConfig from "@/api-docs/config/config";
import { webAppAuthRouter } from "@/components/auth/api/auth.route";
import { webAppOrgRouter } from "@/components/orgs/api/org.route";
import { webAppUserRouter } from "@/components/users/api/user.route";
import { getKeys } from "@/config/keys";

export const setupWebAppRoutes = (router: Router) => {
  const rootPath = "/web-app";
  const { serverPassword, serverUsername, appEnv } = getKeys();

  const options = {
    route: `${rootPath}/docs`,
    config: docsConfig.webAppDocsConfig,
    auth: { username: serverUsername, password: serverPassword },
    appEnv,
  };

  router.use(`${rootPath}/*path`, setupRouteAuth(options.auth.username, options.auth.password));

  router = webAppUserRouter(rootPath, router);
  router = webAppAuthRouter(rootPath, router);
  router = webAppOrgRouter(rootPath, router);

  router = setupDocs(router, options);

  return router;
};
