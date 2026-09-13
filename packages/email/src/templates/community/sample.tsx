import { Button, Link, Text } from "react-email";
import { CommunityEmailLayout } from "../../components/community-email-layout";
import { communityEmailStyles } from "../../styles/community-styles";

export const SampleEmail = () => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>Thriftpool Example email</Text>
    <Text style={communityEmailStyles.paragraph}>Hello there,</Text>
    <Text style={communityEmailStyles.paragraph}>
      You’ve been invited to join the <span style={{ fontWeight: "600" }}>Thriftpool </span>. To get started, accept your invite
      and set up your account
    </Text>
    <Text style={communityEmailStyles.paragraph}>Click below to accept your invite and set up your account:</Text>
    <Button style={communityEmailStyles.button} href="https://dashboard.stripe.com/login">
      Accept Invitation
    </Button>
    <Text style={communityEmailStyles.paragraph}>
      This link will expire in 24 hours, if your link has expired, you can always{" "}
      <Link style={communityEmailStyles.anchor} href="https://docs.stripe.com/dashboard/basics">
        Request a new invitation
      </Link>
    </Text>
    <Text style={communityEmailStyles.paragraph}>If you didn’t expect this invitation, please ignore this email.</Text>
  </CommunityEmailLayout>
);

export default SampleEmail;
