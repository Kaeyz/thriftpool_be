import type { AppEnv, PlatformKey } from "@packages/core/types";
import Redis from "ioredis";
import type { Connection } from "mongoose";
import type { EventDoc, PlatformStatus } from "./event-model";
import { getEventModel } from "./event-model";
import type { EventType } from "./event-registry";
import { eventRegistry } from "./event-registry";

export type EventHandler = (payload: unknown) => Promise<{ ok: boolean; data: unknown }>;

type StreamMessage = [id: string, body: [key: "data", value: string]];
type StreamEvent = [EventType, messages: StreamMessage[]];
type StreamResponse = StreamEvent[];

export class EventBus {
  private connected: boolean = false;
  private redisUrl: string;
  private redis!: Redis;
  private env: AppEnv;
  private platformKey: PlatformKey;
  private eventDB: Connection | null = null;

  private subscriptions: Map<string, EventHandler> = new Map();

  constructor(opts: { redisUrl: string; platformKey: PlatformKey; env: AppEnv }) {
    this.platformKey = opts.platformKey;
    this.redisUrl = opts.redisUrl;
    this.env = opts.env;
  }

  async init(dbConnection: Connection) {
    this.redis = new Redis(this.redisUrl);
    this.redis.on("connect", () => {
      this.connected = true;
      // eslint-disable-next-line no-console
      console.log("Redis connected");
    });
    this.redis.on("close", () => {
      this.connected = false;
      // eslint-disable-next-line no-console
      console.log("Redis connection closed");
    });

    const eventTypes = Object.keys(eventRegistry) as EventType[];

    for (const eventType of eventTypes) {
      const expectedServers = eventRegistry[eventType];
      await this.ensureGroups(`${this.env}:${eventType}`, expectedServers);
    }

    this.eventDB = dbConnection.useDb(`thriftpool_event_${this.env}`, { useCache: true });
  }

  async disconnect() {
    this.redis.disconnect();
  }

  async publish(eventType: EventType, payload: unknown) {
    const expectedPlatforms = eventRegistry[eventType] || [];
    const messageId = await this.redis.xadd(`${this.env}:${eventType}`, "*", "data", JSON.stringify(payload));

    const platformStatuses: PlatformStatus[] = expectedPlatforms.map((platformKey) => {
      return { platformKey, status: "pending", response: null };
    });
    const EventModel = getEventModel(this.eventDB!);
    await EventModel.create({
      publisher: this.platformKey,
      messageId,
      eventType,
      payload,
      expectedPlatforms,
      platformStatuses,
      status: "pending",
    });
    return messageId;
  }

  subscribe(eventType: EventType, handler: EventHandler) {
    const event = `${this.env}:${eventType}`;
    this.subscriptions.set(event, handler);
    void this.startConsumer(event, handler);
  }

  private async startConsumer(eventType: string, handler: EventHandler) {
    const EventModel = getEventModel(this.eventDB!);
    while (true) {
      if (!this.connected) continue;
      const res = (await this.redis.xreadgroup(
        "GROUP",
        this.platformKey,
        `${this.platformKey}-consumer`,
        "BLOCK",
        0,
        "STREAMS",
        eventType,
        ">"
      )) as StreamResponse | null;

      if (!res || res.length === 0) continue;

      for (const [eventType, messages] of res) {
        for (const [messageId, [_key, payloadString]] of messages) {
          let event = await EventModel.findOne<EventDoc>({ messageId });
          try {
            const payload = JSON.parse(payloadString);
            const { ok, data } = await handler(payload);
            await this.redis.xack(eventType, this.platformKey, messageId);
            if (event) {
              event = await EventModel.findOneAndUpdate(
                { messageId: event?.messageId, status: "pending", "platformStatuses.platformKey": this.platformKey },
                { $set: { "platformStatuses.$.status": ok ? "success" : "failed", "platformStatuses.$.response": data } },
                { new: true }
              );
            }
            await this.checkCompletion(messageId);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log("Something went wrong with Consumer");
          }
        }
      }
    }
  }

  private async checkCompletion(messageId: string) {
    const EventModel = getEventModel(this.eventDB!);
    let event = await EventModel.findOne<EventDoc>({ messageId });
    if (!event) return;

    const allDone = event.expectedPlatforms.every((platformKey: string) => {
      const status = event?.platformStatuses.find((v) => v.platformKey === platformKey);
      return status?.status === "success";
    });

    if (allDone) {
      event = await EventModel.findOneAndUpdate<EventDoc>(
        { messageId: event?.messageId },
        { status: "completed" },
        { new: true }
      );
      if (event) await this.redis.xdel(event?.eventType, event?.messageId);
    }
  }

  private async ensureGroups(eventType: string, groups: string[]) {
    for (const group of groups) {
      try {
        await this.redis.xgroup("CREATE", eventType, group, "$", "MKSTREAM");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // eslint-disable-next-line no-console
        if (!err.message.includes("BUSYGROUP")) console.log(err);
      }
    }
  }
}
