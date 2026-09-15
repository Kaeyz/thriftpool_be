import { setupRouteAuth, setupDocs } from "@packages/core/route-config";
import type { Router } from "express";
import docsConfig from "@/api-docs/config/config";
import { getKeys } from "@/config/keys";
import { webAppAuthRouter } from "@/modules/auth";
import { webAppUserRouter } from "@/modules/users";

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

  router = webAppAuthRouter(rootPath, router);
  router = webAppUserRouter(rootPath, router);

  router = setupDocs(router, options);

  return router;
};
