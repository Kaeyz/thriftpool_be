import ForgotPassword from "../templates/community/auth/forgot-password";
import WelcomeEmail from "../templates/community/auth/welcome-email";


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
