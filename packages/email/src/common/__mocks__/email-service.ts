import { vi } from "vitest";
import type { SendEmailResponse } from "../client";

const mockEmailResponse: SendEmailResponse = {
  status: "success",
  data: { id: "email_mock_id" },
};

export class EmailService {
  static sendAdminInviteEmail = vi.fn(() => Promise.resolve(mockEmailResponse));
  static sendResetPasswordEmail = vi.fn(() => Promise.resolve(mockEmailResponse));
}
