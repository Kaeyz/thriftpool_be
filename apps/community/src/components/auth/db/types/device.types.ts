import type { Document } from "mongoose";
import type * as z from "zod";
import type { DeviceSchema } from "../../common/auth.zod";

export type IDevice = {
  user: string;
  deviceType: string;
  platform: string;
  browser: string;
  deviceModel: string;
  os: string;
  appVersion: string;
  country: string;
};

export type DeviceDoc = z.infer<typeof DeviceSchema> & Document;
