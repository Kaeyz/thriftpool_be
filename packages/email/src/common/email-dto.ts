import type { ComponentPropsWithoutRef } from "react";
import type { emailConfigs } from "../config";

export type Configs = typeof emailConfigs;

export type EmailType = keyof Configs;

export type EmailProps<T extends EmailType> = ComponentPropsWithoutRef<Configs[T]["component"]>;

export type EmailTypeToProps = {
  [T in EmailType]: {
    type: T;
    props: EmailProps<T>;
  };
};

export interface MailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  data?: object;
}
