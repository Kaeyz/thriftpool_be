import { Platform } from "@packages/core/types";
import { EmailService } from "@packages/email";
import { discordService } from "./discord";
import { getKeys } from "@/config/keys";

const { resendApiKey, appEnv } = getKeys();

export const emailService = new EmailService<Platform.Community>(Platform.Community, {
  apiKey: resendApiKey,
  appEnv: appEnv,
  discordService,
});
