import type { AxiosInstance } from "axios";

export class AuthService {
  private rootPath = "/auth";

  constructor(private client: AxiosInstance) {}

  async verifySession(orgId: string) {
    return orgId;
  }
}
