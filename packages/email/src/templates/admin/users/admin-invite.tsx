import { Button, Text } from "react-email";
import { CommunityEmailLayout } from "../../../components/community-email-layout";
import { communityEmailStyles } from "../../../styles/community-styles";

export type AdminInviteProps = {
  acceptInviteUrl: string;
};

const AdminInviteEmail = (props: AdminInviteProps) => (
  <CommunityEmailLayout>
    <Text style={communityEmailStyles.h3}>Invitation to ThriftPool Admin Portal</Text>
    <Text style={communityEmailStyles.paragraph}>Hi there,</Text>
    <Text style={communityEmailStyles.paragraph}>
      You’ve been invited to join the <span style={{ fontWeight: "600" }}>Thriftpool Admin Portal</span>. To get started, accept
      your invite and set up your account
    </Text>
    <Text style={communityEmailStyles.paragraph}>Click below to accept your invite and set up your account:</Text>
    <Button style={communityEmailStyles.button} href={props.acceptInviteUrl}>
      Accept Invitation
    </Button>
    <Text style={communityEmailStyles.paragraph}>If you didn’t expect this invitation, please ignore this email.</Text>
  </CommunityEmailLayout>
);

AdminInviteEmail.PreviewProps = {
  acceptInviteUrl: "localhost",
} satisfies AdminInviteProps;

export default AdminInviteEmail;
