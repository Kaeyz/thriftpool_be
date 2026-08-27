import { Button, Link, Text } from "@react-email/components";
import { AccountEmailLayout } from "../../../components/account-email-layout";
import { accountEmailStyles } from "../../../styles/account-styles";

export type ResetPasswordProps = {
  name: string;
  resetLink: string;
};

const ResetPassword = (props: ResetPasswordProps) => (
  <AccountEmailLayout>
    <Text style={accountEmailStyles.h3}>Reset Your Password</Text>
    <Text style={accountEmailStyles.paragraph}>Hello {props.name},</Text>
    <Text style={accountEmailStyles.paragraph}>
      We received a request to reset the password for your account. To reset your password, please click the button below.
    </Text>
    <Button style={accountEmailStyles.button} href={props.resetLink}>
      Reset Password
    </Button>
    <Text style={accountEmailStyles.paragraph}>
      Use this link incase you are unable to click the button above.
      <Link style={accountEmailStyles.anchor} href={props.resetLink}>
        {props.resetLink}
      </Link>
    </Text>
    <Text style={accountEmailStyles.paragraph}>
      This link will expire in 24 hours, if your link has expired, you can always request a new one.
    </Text>
    <Text style={accountEmailStyles.paragraph}>
      If you did not request a password reset, please ignore this email, and your password will remain unchanged.
    </Text>

    <Text style={accountEmailStyles.paragraph}>
      <b>
        Warm regards,
        <br />
        The Thriftpool Team
      </b>
    </Text>
  </AccountEmailLayout>
);

ResetPassword.PreviewProps = {
  name: "John Doe",
  resetLink: "http://reset.com/token",
} satisfies ResetPasswordProps;

export default ResetPassword;
