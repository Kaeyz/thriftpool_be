import type { PlatformKey } from "@packages/core/types";
import type { Connection, Document } from "mongoose";
import mongoose from "mongoose";

export type EventStatus = "pending" | "completed";
export type PlatformStatus = {
  platformKey: PlatformKey;
  status: "pending" | "success" | "failed";
  response: object | null;
};

export interface EventDoc extends Document {
  messageId: string;
  publisher: PlatformKey;
  eventType: string;
  payload: object;
  status: EventStatus;
  expectedPlatforms: string[];
  platformStatuses: PlatformStatus[];
  createdAt: Date;
}

const EventSchema = new mongoose.Schema({
  messageId: String,
  publisher: String,
  eventType: String,
  payload: Object,
  expectedPlatforms: [String],
  status: { type: String, default: "pending" },
  platformStatuses: [
    {
      platformKey: String,
      status: String,
      response: Object,
    },
  ],
});

export const getEventModel = (connection: Connection) => {
  return connection.models.events || connection.model<EventDoc>("events", EventSchema);
};
