import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log(`Email sent Successfully! : ${{ res }}`);
  } catch (err) {
    console.log(`Error sending email! : ${err.message}`);
    throw err;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "aa218deb-5c8d-4dde-be8f-427d66206207",
      template_variables: {
        name,
        company_info_name: "AUTH COMPANY",
      },
    });
    console.log(`Welcome email sent Successfully! : ${{ res }}`);
  } catch (err) {
    console.log(`Error sending welcome email! : ${err.message}`);
    throw err;
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log(`Reset Password email sent Successfully! : ${{ res }}`);
  } catch (err) {
    console.log(`Error sending reset password email! : ${err.message}`);
    throw err;
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log(`Password Reset Successfully! : ${{ res }}`);
  } catch (err) {
    console.log(`Error in reseting password : ${err.message}`);
    throw err;
  }
};
