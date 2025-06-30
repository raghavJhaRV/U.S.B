// backend/mailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'hotmail', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"United S.T.O.R.M. Basketball" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
