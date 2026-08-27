import { platformUrlMap } from "@packages/core/platform-urls";
import type { AppEnv } from "@packages/core/types";
import type { CreateAxiosDefaults } from "axios";
import axios from "axios";
import { AuthService } from "./auth/auth-service";
import { OrgService } from "./org/org-service";

type AccountServerConfig = {
  userName: string;
  password: string;
  env: AppEnv;
};

export class AccountServer {
  private clientAuth: CreateAxiosDefaults["auth"];
  private baseUrl: string;
  private client;

  orgs: OrgService;
  auth: AuthService;

  constructor(config: AccountServerConfig) {
    this.clientAuth = { username: config.userName, password: config.password };
    this.baseUrl = platformUrlMap[config.env].account.apiUrl;
    this.client = axios.create({ baseURL: this.baseUrl, auth: this.clientAuth });

    this.orgs = new OrgService(this.client);
    this.auth = new AuthService(this.client);
  }
}
