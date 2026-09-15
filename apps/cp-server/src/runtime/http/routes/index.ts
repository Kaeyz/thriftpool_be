import { Router } from "@packages/runtime/http";
import { type Application, type Request, type Response } from "express";

import { setupWebAppRoutes } from "./web-app";

export default (app: Application): Application => {
  let router = Router();

  router = setupWebAppRoutes(router);

  router.get("/", (_req: Request, res: Response) => {
    return res.status(200).json({ message: "App is live" });
  });

  app.use(router);
  router.use("*path", (_req, res) => res.status(404).json({ message: "Route does not exist" }));

  return app;
};
