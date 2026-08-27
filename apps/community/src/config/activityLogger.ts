import type { Express } from "express";
import { createLogger, transports, format } from "winston";

const activityLogger = createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "community-server" },
  transports: [new transports.Console()],
});

export const setupActivityLogger = (app: Express) => {
  app.use((req, res, next) => {
    if (req.path.includes("docs") || req.path.includes("socket")) {
      return next();
    }
    const sendFunc = res.send;
    res.send = function (...args) {
      const data = JSON.parse(args["0"]);
      //data.requestId = getUniqueId();
      const payload = {
        path: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        /* body: req.body,
        query: req.query,
        response: data,
        */
      };
      activityLogger.info("Api Request", { logData: payload });
      //if (keys.appEnv !== "production") console.log(JSON.stringify(payload));
      return sendFunc.apply(res, args);
    };
    return next();
  });
};
