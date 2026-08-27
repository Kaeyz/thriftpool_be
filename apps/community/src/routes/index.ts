import type { Express, Request, Response } from "express";
import { Router } from "express";

import { setupServerApiRoutes } from "./server-api";
import { setupWebAppRoutes } from "./web-app";

export default (app: Express): Express => {
  let router = Router();

  router = setupWebAppRoutes(router);
  router = setupServerApiRoutes(router);

  router.get("/", (_req: Request, res: Response) => {
    return res.status(200).json({ message: "App is live" });
  });

  app.use(router);
  router.use("*path", (_req, res) => res.status(404).json({ message: "Route does not exist" }));

  return app;
};
