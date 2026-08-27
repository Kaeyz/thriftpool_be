import type { AxiosInstance } from "axios";
import type { CreateOrgResponse, GetOrgResponse, OrgInput } from "./org-dto";
import { requestHandler } from "@/http/request-handler";

export class OrgService {
  private rootPath = "/orgs";

  constructor(private client: AxiosInstance) {}

  getOrg(orgId: string) {
    const request = this.client.get(`${this.rootPath}/${orgId}`);
    return requestHandler<GetOrgResponse>(request);
  }

  createOrg(data: OrgInput) {
    const request = this.client.post(this.rootPath, data);
    return requestHandler<CreateOrgResponse>(request);
  }

  updateOrg(orgId: string, data: OrgInput) {
    const request = this.client.put(`${this.rootPath}/${orgId}`, data);
    return requestHandler<CreateOrgResponse>(request);
  }
}
