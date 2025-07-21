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

// Send admin notification for new registration
export async function sendAdminRegistrationNotification(registration: any) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }

  const html = `
    <h2>🎯 New Player Registration</h2>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Player Information</h3>
      <p><strong>Player Name:</strong> ${registration.playerName}</p>
      <p><strong>Parent Name:</strong> ${registration.parentName || 'Not provided'}</p>
      <p><strong>Email:</strong> ${registration.email}</p>
      <p><strong>Phone:</strong> ${registration.phone || 'Not provided'}</p>
      <p><strong>Team ID:</strong> ${registration.teamId}</p>
      <p><strong>Program ID:</strong> ${registration.programId}</p>
      <p><strong>Waiver Accepted:</strong> ${registration.waiverAccepted ? 'Yes' : 'No'}</p>
      ${registration.eTransferNote ? `<p><strong>E-Transfer Note:</strong> ${registration.eTransferNote}</p>` : ''}
      <p><strong>Registration Date:</strong> ${new Date(registration.createdAt).toLocaleString()}</p>
    </div>
    <p><a href="${process.env.FRONTEND_URL || 'https://u-s-b-frontend.onrender.com'}/admin/registrations" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
    <p>Best regards,<br>United S.T.O.R.M. Basketball System</p>
  `;

  await sendMail(
    adminEmail,
    `New Registration: ${registration.playerName} - United S.T.O.R.M. Basketball`,
    html
  );
}

// Send admin notification for new merchandise purchase
export async function sendAdminPurchaseNotification(purchase: any) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }

  const html = `
    <h2>🛒 New Merchandise Purchase</h2>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Purchase Details</h3>
      <p><strong>Order Number:</strong> ${purchase.orderNumber || 'N/A'}</p>
      <p><strong>Customer Name:</strong> ${purchase.customerName}</p>
      <p><strong>Customer Email:</strong> ${purchase.customerEmail}</p>
      <p><strong>Amount:</strong> $${(purchase.amount / 100).toFixed(2)} CAD</p>
      <p><strong>Transaction ID:</strong> ${purchase.transactionId}</p>
      <p><strong>Payment Method:</strong> ${purchase.type}</p>
      <p><strong>Purchase Date:</strong> ${new Date(purchase.createdAt).toLocaleString()}</p>
      ${purchase.comments ? `<p><strong>Comments:</strong> ${purchase.comments}</p>` : ''}
    </div>
    <p><a href="${process.env.FRONTEND_URL || 'https://u-s-b-frontend.onrender.com'}/admin/payments" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
    <p>Best regards,<br>United S.T.O.R.M. Basketball System</p>
  `;

  await sendMail(
    adminEmail,
    `New Purchase: $${(purchase.amount / 100).toFixed(2)} - ${purchase.customerName}`,
    html
  );
}

// Send admin notification for new contact form submission
export async function sendAdminContactNotification(contact: any) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }

  const html = `
    <h2>📧 New Contact Form Submission</h2>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
        ${contact.message.replace(/\n/g, '<br>')}
      </div>
      <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
    </div>
    <p><a href="${process.env.FRONTEND_URL || 'https://u-s-b-frontend.onrender.com'}/admin/contact" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
    <p>Best regards,<br>United S.T.O.R.M. Basketball System</p>
  `;

  await sendMail(
    adminEmail,
    `New Contact: ${contact.name} - United S.T.O.R.M. Basketball`,
    html
  );
}