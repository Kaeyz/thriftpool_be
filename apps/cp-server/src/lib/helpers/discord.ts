import { DiscordService } from "@packages/core/discord";
import { getKeys } from "@/config/keys";

const { discord: discordKeys } = getKeys();

export const discordService = new DiscordService({ ...discordKeys, serverName: "cp-server" });
