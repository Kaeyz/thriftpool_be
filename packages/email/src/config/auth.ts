import ForgotPassword from "../templates/cp/auth/forgot-password";
import WelcomeEmail from "../templates/cp/auth/welcome-email";

export const authEmailConfig = {
  welcomeEmail: {
    subject: "Welcome to thriftpool",
    component: WelcomeEmail,
  },
  forgotPassword: {
    subject: "Forgot Your Password",
    component: ForgotPassword,
  },
};
