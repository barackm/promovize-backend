import * as nodemailer from 'nodemailer';
import { smtp } from '../local.config';

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: {
    user: smtp.username,
    pass: smtp.password,
  },
});

export const sendWelcomeEmail = async (email: string, displayName: string) => {};
export const sendPasswordResetEmail = async (email: string, displayName: string) => {};
export const sendPasswordChangedEmail = async (email: string, displayName: string) => {};
// confirmEmail
export const sendConfirmEmail = async (email: string, displayName: string) => {
  const mailOptions = {
    from: 'Promovize <support@promovize.app>',
    to: email,
    subject: 'Welcome to Promovize!',
    html: `
            <div>
                <h1>Welcome to Promovize</h1>
                <p>Hi ${displayName},</p>
                <p>Thanks for signing up for Your App! We're excited to have you as an early user.</p>
                <p>Before we get started, we need to confirm your email address. Click the link below to confirm your email address:</p>
                <p><a href="https://your-app.com/confirm-email?email=${email}">Confirm Email Address</a></p>
                <p>Thanks,</p>
                <p>Promovize Team</p>
            </div>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};
