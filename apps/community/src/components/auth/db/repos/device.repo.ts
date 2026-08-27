import type { DeviceInput } from "../../common/auth.dto";
import Device from "../models/device.model";
import type { DeviceDoc } from "../types/device.types";
import type { Ctx } from "@/lib/request-context/config";

export class DeviceRepository {
  static async create(ctx: Ctx, data: DeviceInput): Promise<DeviceDoc> {
    return new Device(data).save({ session: ctx?.session }) as unknown as DeviceDoc;
  }

  static getById(ctx: Ctx, id: string): Promise<DeviceDoc | null> {
    return Device.findById(id, {}, { session: ctx?.session });
  }
}
