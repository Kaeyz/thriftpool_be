import type { PlatformKey } from "@packages/core/types";

export type EventType = "user-profile:updated" | "user-profile:created";

export const eventRegistry: Record<EventType, PlatformKey[]> = {
  "user-profile:updated": ["medivault"],
  "user-profile:created": ["medivault"],
};
