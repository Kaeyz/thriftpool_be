import * as React from "react";
import { Html, Body, Head, Text, Container, Img, Hr, Section } from "react-email";
import { communityEmailStyles } from "../styles/community-styles";

const logoUrl = "https://res.cloudinary.com/kaeyz/image/upload/v1769521376/thriftpool/assets/thriftpool_pool.png";

export interface EmailLayoutDto {
  children: React.ReactNode;
}

export const CommunityEmailLayout = ({ children }: EmailLayoutDto) => (
  <Html>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,400;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Body style={communityEmailStyles.main}>
      <Container style={communityEmailStyles.container}>
        <Section style={communityEmailStyles.box}>
          <Img src={logoUrl} width="50px" height="50px" alt="Thriftpool Logo" />
          <Hr style={communityEmailStyles.hr} />
          {children}
        </Section>
        <Text style={communityEmailStyles.footer}>© 2026 Thriftpool</Text>
      </Container>
    </Body>
  </Html>
);
