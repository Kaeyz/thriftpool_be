import { Html, Body, Head, Text, Container, Img, Hr, Section } from "@react-email/components";
import * as React from "react";
import { accountEmailStyles } from "../styles/account-styles";

const logoUrl = "https://res.cloudinary.com/kaeyz/image/upload/v1769521376/thriftpool/assets/thriftpool_pool.png";

export interface EmailLayoutDto {
  children: React.ReactNode;
}

export const AccountEmailLayout = ({ children }: EmailLayoutDto) => (
  <Html>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,400;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Body style={accountEmailStyles.main}>
      <Container style={accountEmailStyles.container}>
        <Section style={accountEmailStyles.box}>
          <Img src={logoUrl} width="50px" height="50px" alt="Thriftpool Logo" />
          <Hr style={accountEmailStyles.hr} />
          {children}
        </Section>
        <Text style={accountEmailStyles.footer}>© 2026 Thriftpool</Text>
      </Container>
    </Body>
  </Html>
);
