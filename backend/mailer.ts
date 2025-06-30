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

export async function sendRegistrationConfirmation(email: string, playerName: string, eTransferNote?: string) {
  const html = `
    <p>Hi ${playerName},</p>
    <p>You have successfully registered for the program.</p>
    ${
      eTransferNote
        ? `<p><strong>E-Transfer Instructions:</strong><br>${eTransferNote}</p>`
        : ''
    }
    <p>We will contact you soon with more details.</p>
    <p>Thank you,<br>United S.T.O.R.M. Basketball</p>
  `;

  await sendMail(
    email,
    'Registration Confirmation - United S.T.O.R.M.',
    html
  );
}