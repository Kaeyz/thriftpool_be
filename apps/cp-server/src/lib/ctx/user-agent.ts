import type { Request } from "express";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export type UserAgent = {
  deviceType: string;
  platform: string;
  browser: string;
  deviceModel: string;
  os: string;
  country: string;
};

export const getUserAgent = (req: Request) => {
  const ip = req.ip as string;
  const uaString = req.headers["user-agent"];
  const parser = new UAParser(uaString);
  const result = parser.getResult();
  const geo = geoip.lookup(ip);

  const userAgent: UserAgent = {
    deviceType: result.device.type || "Unknown",
    platform: result.os.name || "Unknown",
    browser: result.browser.name || "Unknown",
    deviceModel: result.device.model || "Unknown",
    os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
    country: (req.headers["cf-ipcountry"] as string) || geo?.country || "Unknown",
  };

  req.ctx = { ...req.ctx, userAgent };
};
