import { DeviceRepository } from "../db/repos/device.repo";
import { AuthUtils } from "./auth.utils";
import type { Ctx } from "@/lib/request-context/config";

export class DeviceService {
  static async getDevice(ctx: Ctx, id: string) {
    const device = await DeviceRepository.getById(ctx, id);
    if (!device) throw Error("Unable to get device");
    return AuthUtils.sanitizeDevice(device);
  }
}
