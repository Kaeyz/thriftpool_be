import React from "react";
import { Button, Text } from "react-email";
import { CommunityEmailLayout } from "../../../components/community-email-layout";
import { communityEmailStyles } from "../../../styles/community-styles";

export type MemberInviteProps = {
  communityName: string;
  platformUrl: string;
};

const MemberInviteEmail = (props: MemberInviteProps) => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>{`Invitation to ${props.communityName}`}</Text>
    <Text style={communityEmailStyles.paragraph}>Hi there,</Text>
    <Text style={communityEmailStyles.paragraph}>
      You’ve been invited to join <span style={{ fontWeight: "600" }}>{props.communityName}</span>. To get started, set up your
      account and accept invite
    </Text>
    <Button style={communityEmailStyles.button} href={props.platformUrl}>
      Signup
    </Button>
  </CommunityEmailLayout>
);

MemberInviteEmail.PreviewProps = {
  communityName: "Test Community",
  platformUrl: "localhost",
} satisfies MemberInviteProps;

export default MemberInviteEmail;
