import { render } from "@react-email/render";
import { emailConfigs } from "../config";
import type { EmailConfig } from "./client";
import { sendMail } from "./client";
import type { EmailType, EmailProps } from "./email-dto";

export class EmailService {
  private emailConfig: EmailConfig;

  constructor(config: EmailConfig) {
    this.emailConfig = config;
  }

  public async send<T extends EmailType>(type: T, receiverEmail: string, data: EmailProps<T>) {
    const template = emailConfigs[type];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = await render(template.component(data as any));

    return sendMail(
      {
        to: receiverEmail,
        subject: template.subject,
        html,
        data,
      },
      this.emailConfig
    );
  }
}
