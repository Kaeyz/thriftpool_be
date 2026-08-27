import { Html, Body, Head, Text, Container, Img, Hr, Section } from "@react-email/components";
import * as React from "react";
import { medivaultEmailStyles } from "../styles/medivault-styles";

const logoUrl = "https://res.cloudinary.com/kaeyz/image/upload/v1769521376/thriftpool/assets/thriftpool_logo.png";

export interface EmailLayoutDto {
  children: React.ReactNode;
}

export const MedivaultEmailLayout = ({ children }: EmailLayoutDto) => (
  <Html>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,400;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Body style={medivaultEmailStyles.main}>
      <Container style={medivaultEmailStyles.container}>
        <Section style={medivaultEmailStyles.box}>
          <Img src={logoUrl} width="50px" height="50px" alt="Medivault Logo" />
          <Hr style={medivaultEmailStyles.hr} />
          {children}
        </Section>
        <Text style={medivaultEmailStyles.footer}>© 2026 Thriftpool Suite</Text>
      </Container>
    </Body>
  </Html>
);
