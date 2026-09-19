import React from "react";
import { Text } from "react-email";
import { CommunityEmailLayout } from "../../../components/community-email-layout";
import { communityEmailStyles } from "../../../styles/community-styles";

export type VerifyAccountProps = {
  name: string;
  token: string;
};

const VerifyAccount = (props: VerifyAccountProps) => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>Verify your account</Text>
    <Text style={communityEmailStyles.paragraph}>Hello {props.name},</Text>
    <Text style={communityEmailStyles.paragraph}>To verify your account, please use the token below below.</Text>
    <Text style={communityEmailStyles.token}>{props.token}</Text>
    <Text style={communityEmailStyles.paragraph}>
      This token will expire in 24 hours, if your token has expired, you can always request a new one.
    </Text>
  </CommunityEmailLayout>
);

VerifyAccount.PreviewProps = {
  name: "John Doe",
  token: "12345",
} satisfies VerifyAccountProps;

export default VerifyAccount;
