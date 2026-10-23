import type { Platform } from "@packages/core/enums";
import type { ComponentType, ReactElement } from "react";
import type { emailConfigs } from "../config";

export type EmailTemplate = {
  subject: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
};

export type EmailConfigs = typeof emailConfigs;

export type EmailType<P extends Platform> = keyof EmailConfigs[P];

export type EmailProps<P extends Platform, T extends EmailType<P>> = EmailConfigs[P][T] extends {
  component: (props: infer Props) => ReactElement;
}
  ? Props
  : never;

export type EmailTypeToProps<P extends Platform> = { [T in EmailType<P>]: { type: T; props: EmailProps<P, T> } };

export interface MailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  data?: object;
}
