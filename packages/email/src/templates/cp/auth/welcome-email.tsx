import React from "react";
import { Text } from "react-email";
import { CommunityEmailLayout } from "../../../components/community-email-layout";
import { communityEmailStyles } from "../../../styles/community-styles";

export type WelcomeEmailProps = {
  name: string;
  token: string;
};

const WelcomeEmail = (props: WelcomeEmailProps) => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>Welcome to Thriftpool</Text>
    <Text style={communityEmailStyles.paragraph}>Hello {props.name},</Text>
    <Text style={communityEmailStyles.paragraph}>Welcome to thriftpool, use token to verify your account</Text>
    <Text style={communityEmailStyles.token}>{props.token}</Text>
  </CommunityEmailLayout>
);

WelcomeEmail.PreviewProps = {
  name: "John Doe",
  token: "12345",
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
