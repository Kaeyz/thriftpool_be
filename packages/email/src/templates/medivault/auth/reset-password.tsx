import { Button, Link, Text } from "@react-email/components";
import { MedivaultEmailLayout } from "../../../components/medivault-email-layout";
import { medivaultEmailStyles } from "../../../styles/medivault-styles";

export type ResetPasswordProps = {
  name: string;
  resetLink: string;
};

const ResetPassword = (props: ResetPasswordProps) => (
  <MedivaultEmailLayout>
    <Text style={medivaultEmailStyles.h3}>Reset Your Password</Text>
    <Text style={medivaultEmailStyles.paragraph}>Hello {props.name},</Text>
    <Text style={medivaultEmailStyles.paragraph}>
      We received a request to reset the password for your account. To reset your password, please click the button below.
    </Text>
    <Button style={medivaultEmailStyles.button} href={props.resetLink}>
      Reset Password
    </Button>
    <Text style={medivaultEmailStyles.paragraph}>
      Use this link incase you are unable to click the button above.
      <Link style={medivaultEmailStyles.anchor} href={props.resetLink}>
        {props.resetLink}
      </Link>
    </Text>
    <Text style={medivaultEmailStyles.paragraph}>
      This link will expire in 24 hours, if your link has expired, you can always request a new one.
    </Text>
    <Text style={medivaultEmailStyles.paragraph}>
      If you did not request a password reset, please ignore this email, and your password will remain unchanged.
    </Text>

    <Text style={medivaultEmailStyles.paragraph}>
      <b>
        Warm regards,
        <br />
        The Thriftpool Team
      </b>
    </Text>
  </MedivaultEmailLayout>
);

ResetPassword.PreviewProps = {
  name: "John Doe",
  resetLink: "http://reset.com/token",
} satisfies ResetPasswordProps;

export default ResetPassword;
