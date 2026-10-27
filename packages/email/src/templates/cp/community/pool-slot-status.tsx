import React from "react";
import { Button, Text } from "react-email";
import { CommunityEmailLayout } from "../../../components/community-email-layout";
import { communityEmailStyles } from "../../../styles/community-styles";

export type PoolSlotStatusProps = {
  memberName: string;
  recipientName?: string;
  recipientType?: "slot_owner" | "pool_owner";
  poolName: string;
  status: "pending" | "approved" | "rejected" | "revoked";
  platformUrl?: string;
};

const statusMessages: Record<PoolSlotStatusProps["status"], string> = {
  pending: "Your pool slot request is now pending approval.",
  approved: "Your pool slot has been approved.",
  rejected: "Your pool slot request has been rejected.",
  revoked: "Your pool slot has been revoked.",
};

const PoolSlotStatusEmail = ({
  memberName,
  recipientName,
  recipientType = "slot_owner",
  poolName,
  status,
  platformUrl,
}: PoolSlotStatusProps) => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>Pool slot update</Text>
    <Text style={communityEmailStyles.paragraph}>Hello {recipientName || memberName},</Text>
    <Text style={communityEmailStyles.paragraph}>
      {recipientType === "pool_owner" && (status === "approved" || status === "rejected")
        ? `${memberName} ${status === "approved" ? "accepted" : "rejected"} their pool slot.`
        : statusMessages[status]}
    </Text>
    <Text style={communityEmailStyles.paragraph}>
      Pool: <span style={{ fontWeight: 600 }}>{poolName}</span>
    </Text>
    {platformUrl && (
      <Button style={communityEmailStyles.button} href={platformUrl}>
        Open platform
      </Button>
    )}
  </CommunityEmailLayout>
);

PoolSlotStatusEmail.PreviewProps = {
  memberName: "John Doe",
  poolName: "Community Savings Pool",
  status: "approved",
  platformUrl: "https://app.thriftpool.com",
} satisfies PoolSlotStatusProps;

export default PoolSlotStatusEmail;
