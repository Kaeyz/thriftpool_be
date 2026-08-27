import { addVirtualId, parseSelectFromSchema, transform } from "@packages/core/database";
import type { Model, Query } from "mongoose";
import { Schema, models, model } from "mongoose";
import { UserInDeviceSchema } from "../../common/auth.zod";
import type { DeviceDoc, IDevice } from "../types/device.types";

const DeviceModel: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    deviceType: String,
    platform: String,
    browser: String,
    deviceModel: String,
    os: String,
    appVersion: String,
    country: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

addVirtualId(DeviceModel);

const autoPopulate = function (this: Query<DeviceDoc, IDevice>, next: () => void) {
  this.populate([{ transform, path: "user", select: parseSelectFromSchema(UserInDeviceSchema) }]);
  next();
};

DeviceModel.pre(["findOne", "findOneAndUpdate", "find"], autoPopulate);

const Device: Model<IDevice> = models.devices || model<IDevice>("devices", DeviceModel);

export default Device;
