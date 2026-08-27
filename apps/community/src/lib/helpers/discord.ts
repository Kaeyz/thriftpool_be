import { DiscordService } from "@packages/core/discord";
import { getKeys } from "@/config/keys";

const discordKeys = getKeys().discord;

export const discordService = new DiscordService({ ...discordKeys, serverName: "account-server" });
