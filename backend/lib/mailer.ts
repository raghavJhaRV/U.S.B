// backend/lib/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"United S.T.O.R.M." <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html,
  });
}

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