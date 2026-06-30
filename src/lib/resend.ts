import ResetPasswordEmail from '@/emails/ResetPasswordEmail';
import VerificationEmail from '@/emails/VerificationEmail';
import { Resend } from 'resend';

// Ensure we don't crash at build time if the env variable isn't set yet
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

const FROM_EMAIL = 'onboarding@resend.dev'; // Replace with your verified domain in production
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${APP_URL}/verify-email?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your email address',
      react: VerificationEmail({ verificationLink }),
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your password',
      react: ResetPasswordEmail({ resetLink }),
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
};
