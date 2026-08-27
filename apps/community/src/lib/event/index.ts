import { EventBus } from "@packages/runtime/event-bus";
import mongoose from "mongoose";
import { getKeys } from "@/config/keys";

const { redisUrl, appEnv } = getKeys();

export const eventService = new EventBus({ redisUrl, platformKey: "community-server", env: appEnv });

const setupSubscribers = async () => {
  /* eventService.subscribe("user-profile:updated", async (data) => {
    console.log("i got this Data", data);
    return { ok: true };
  }); */
};

export const setupRedis = async () => {
  await eventService.init(mongoose.connection);
  await setupSubscribers();
};
