import { setupRouteAuth, setupDocs } from "@packages/core/route-config";
import type { Router } from "express";
import docsConfig from "@/api-docs/config/config";
import { getKeys } from "@/config/keys";
import { webAppAuthRouter } from "@/modules/auth/api/auth.routes";
import { webAppBankAccountRouter } from "@/modules/bank-accounts/api/bank-account.routes";
import { webAppCommunityRouter } from "@/modules/communities/api/community.routes";
import { webAppCommunityInviteRouter } from "@/modules/community-invites/api/community-invite.routes";
import { webAppCommunityMemberRouter } from "@/modules/community-members/api/community-member.routes";
import { webAppPoolRouter } from "@/modules/pools/api/pool.routes";
import { webAppUserRouter } from "@/modules/users/api/user.routes";
import { webAppUtilsRouter } from "@/modules/utils/api/utils.routes";

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
  router = webAppBankAccountRouter(rootPath, router);
  router = webAppCommunityRouter(rootPath, router);
  router = webAppCommunityInviteRouter(rootPath, router);
  router = webAppCommunityMemberRouter(rootPath, router);
  router = webAppPoolRouter(rootPath, router);
  router = webAppUtilsRouter(rootPath, router);

  router = setupDocs(router, options);

  return router;
};
