import type { DiscordService } from "@packages/core/discord";
import type { AppEnv } from "@packages/core/types";
import type { CreateEmailResponseSuccess, ErrorResponse } from "resend";
import { Resend } from "resend";
import type { MailData } from "./email-dto";

const getEmailClient = (apiKey: string) => {
  return new Resend(apiKey);
};

export type SendEmailResponse =
  | {
      status: "failed";
      data: ErrorResponse;
    }
  | {
      status: "success";
      data: CreateEmailResponseSuccess | null;
    };

export type EmailConfig = {
  apiKey: string;
  appEnv: AppEnv;
  discordService: DiscordService;
};

export const sendMail = async (payload: MailData, config: EmailConfig): Promise<SendEmailResponse> => {
  try {
    const { to, subject, html, data } = payload;
    if (config.appEnv !== "prod") {
      await config.discordService.sendMessage("serverLogs", {
        data: data as object,
        env: config.appEnv,
        subject: `${subject}-${to}`,
        type: "Mail",
      });
      return { data: null, status: "success" };
    }
    const client = getEmailClient(config.apiKey);
    const { data: mailRes, error } = await client.emails.send({
      from: "thriftpool@clearerangle.com",
      to,
      subject,
      html,
    });
    if (error) return { data: error, status: "failed" };
    return { data: mailRes, status: "success" };
  } catch (error) {
    return { data: error as ErrorResponse, status: "failed" };
  }
};
