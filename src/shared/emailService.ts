import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info(`📧 Email sent to ${to}`);
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}: ${(error as Error).message}`);
    throw error;
  }
};

export const emailService = {
  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Welcome to GymFlow!</h1>
          <p style="color: #666; font-size: 16px;">Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-size: 16px; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #999; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
          <p style="color: #999; font-size: 14px;">This link will expire in 24 hours.</p>
        </body>
      </html>
    `;

    await sendEmail(to, 'Verify Your Email - GymFlow', html);
  },

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Password Reset Request</h1>
          <p style="color: #666; font-size: 16px;">You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-size: 16px; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <p style="color: #999; font-size: 14px;">This link will expire in 1 hour.</p>
        </body>
      </html>
    `;

    await sendEmail(to, 'Reset Your Password - GymFlow', html);
  },
};
