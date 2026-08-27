import { setupRouteAuth, setupDocs } from "@packages/core/route-config";
import type { Router } from "express";
import docsConfig from "@/api-docs/config/config";
import { serverApiAuthRouter } from "@/components/auth/api/auth.route";
import { serverApiOrgRouter } from "@/components/orgs/api/org.route";
import { getKeys } from "@/config/keys";

export const setupServerApiRoutes = (router: Router) => {
  const rootPath = "/server-api";
  const { serverPassword, serverUsername, appEnv } = getKeys();

  const options = {
    route: `${rootPath}/docs`,
    config: docsConfig.serverApiDocsConfig,
    auth: { username: serverUsername, password: serverPassword },
    appEnv,
  };

  router.use(`${rootPath}/*path`, setupRouteAuth(options.auth.username, options.auth.password));

  router = serverApiAuthRouter(rootPath, router);
  router = serverApiOrgRouter(rootPath, router);

  router = setupDocs(router, options);

  return router;
};
