import type { Router, Request, Response, NextFunction } from "express";
import basicAuth from "express-basic-auth";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import type { SwaggerUiOptions } from "swagger-ui-express";
import { generateHTML, serveFiles } from "swagger-ui-express";
import { AppError, StatusCodes } from "./res-config";
import type { AppEnv } from "./types";

export const setupRouteAuth = (username: string, password: string): ReturnType<typeof basicAuth> => {
  const getUnauthorizedResponse = (req: basicAuth.IBasicAuthedRequest) => {
    return req.auth
      ? new AppError(StatusCodes.UNAUTHENTICATED, "Invalid Auth Credentials")
      : new AppError(StatusCodes.UNAUTHENTICATED, "No auth credentials provided");
  };

  return basicAuth({
    users: { [username]: password },
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse,
  });
};

export const useBasicAuth = (username: string, password: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return setupRouteAuth(username, password)(req, res, next);
  };
};

interface options {
  appEnv: AppEnv;
  route: string;
  config: object;
  auth: { username: string; password: string };
}

export const setupDocs = (router: Router, options: options) => {
  const theme = new SwaggerTheme();
  const { route, config } = options;

  const themeConfig: SwaggerUiOptions = {
    explorer: false,
    customCss: `
    ${theme.getBuffer(SwaggerThemeNameEnum.FEELING_BLUE)}
    .swagger-ui > div:nth-child(2) > .wrapper:last-child {
      display: none !important;
    }
  `,
  };

  if (options.appEnv === "test") {
    const swaggerHtml = generateHTML(config, themeConfig);
    router.use(route, serveFiles(config));
    router.get(route, (_req: Request, res: Response) => res.send(swaggerHtml));
  }

  return router;
};
