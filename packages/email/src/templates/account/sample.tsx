import { Button, Link, Text } from "@react-email/components";
import { AccountEmailLayout } from "../../components/account-email-layout";
import { accountEmailStyles } from "../../styles/account-styles";

export const SampleEmail = () => (
  <AccountEmailLayout>
    <Text style={accountEmailStyles.h3}>Medivault Example email</Text>
    <Text style={accountEmailStyles.paragraph}>Hello there,</Text>
    <Text style={accountEmailStyles.paragraph}>
      You’ve been invited to join the <span style={{ fontWeight: "600" }}>Medivault </span>. To get started, accept your invite
      and set up your account
    </Text>
    <Text style={accountEmailStyles.paragraph}>Click below to accept your invite and set up your account:</Text>
    <Button style={accountEmailStyles.button} href="https://dashboard.stripe.com/login">
      Accept Invitation
    </Button>
    <Text style={accountEmailStyles.paragraph}>
      This link will expire in 24 hours, if your link has expired, you can always{" "}
      <Link style={accountEmailStyles.anchor} href="https://docs.stripe.com/dashboard/basics">
        Request a new invitation
      </Link>
    </Text>
    <Text style={accountEmailStyles.paragraph}>If you didn’t expect this invitation, please ignore this email.</Text>
  </AccountEmailLayout>
);

export default SampleEmail;
