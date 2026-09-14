import type { Platform } from "@packages/core/types";
import { createElement } from "react";
import { render } from "react-email";
import { emailConfigs } from "../config";
import type { EmailConfig } from "./client";
import { sendMail } from "./client";
import type { EmailTemplate } from "./email-dto";
import { type EmailProps, type EmailType } from "./email-dto";

export class EmailService<P extends Platform> {
  constructor(
    private readonly platform: P,
    private readonly emailConfig: EmailConfig
  ) {}

  public async send<T extends EmailType<P>>(type: T, receiverEmail: string, data: EmailProps<P, T>) {
    const template = emailConfigs[this.platform][type] as EmailTemplate;

    const element = createElement(template.component, data);
    const html = await render(element);

    return sendMail(
      {
        to: receiverEmail,
        subject: template.subject,
        html,
        data: data as object,
      },
      this.emailConfig
    );
  }
}
