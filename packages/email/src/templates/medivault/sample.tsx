import { Button, Link, Text } from "@react-email/components";
import { MedivaultEmailLayout } from "../../components/medivault-email-layout";
import { medivaultEmailStyles } from "../../styles/medivault-styles";

export const SampleEmail = () => (
  <MedivaultEmailLayout>
    <Text style={medivaultEmailStyles.h3}>Medivault Example email</Text>
    <Text style={medivaultEmailStyles.paragraph}>Hello there,</Text>
    <Text style={medivaultEmailStyles.paragraph}>
      You’ve been invited to join the <span style={{ fontWeight: "600" }}>Medivault </span>. To get started, accept your invite
      and set up your account
    </Text>
    <Text style={medivaultEmailStyles.paragraph}>Click below to accept your invite and set up your account:</Text>
    <Button style={medivaultEmailStyles.button} href="https://dashboard.stripe.com/login">
      Accept Invitation
    </Button>
    <Text style={medivaultEmailStyles.paragraph}>
      This link will expire in 24 hours, if your link has expired, you can always{" "}
      <Link style={medivaultEmailStyles.anchor} href="https://docs.stripe.com/dashboard/basics">
        Request a new invitation
      </Link>
    </Text>
    <Text style={medivaultEmailStyles.paragraph}>If you didn’t expect this invitation, please ignore this email.</Text>
  </MedivaultEmailLayout>
);

export default SampleEmail;
