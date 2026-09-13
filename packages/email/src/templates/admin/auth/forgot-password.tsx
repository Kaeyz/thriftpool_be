import { Text } from "react-email";
import { CommunityEmailLayout } from "../../../components/community-email-layout";
import { communityEmailStyles } from "../../../styles/community-styles";

export type ForgotPasswordProps = {
  name: string;
  token: string;
};

const ForgotPassword = (props: ForgotPasswordProps) => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>Reset Your Password</Text>
    <Text style={communityEmailStyles.paragraph}>Hello {props.name},</Text>
    <Text style={communityEmailStyles.paragraph}>
      We received a request to reset the password for your account. To reset your password, please click the button below.
    </Text>
    <Text style={communityEmailStyles.token}>{props.token}</Text>
    <Text style={communityEmailStyles.paragraph}>
      This token will expire in 24 hours, if your token has expired, you can always request a new one.
    </Text>
    <Text style={communityEmailStyles.paragraph}>
      If you did not request a password reset, please ignore this email, and your password will remain unchanged.
    </Text>
  </CommunityEmailLayout>
);

ForgotPassword.PreviewProps = {
  name: "John Doe",
  token: "12345",
} satisfies ForgotPasswordProps;

export default ForgotPassword;
