// backend/api/contact.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { sendMail } from '../lib/mailer';

// POST /api/contact - Submit contact form
export async function POST(req: Request, res: Response) {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Save contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    // Send notification email to admin (optional)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendMail(
          adminEmail,
          'New Contact Form Submission - United S.T.O.R.M. Basketball',
          `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          `
        );
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Send confirmation email to user
    try {
      await sendMail(
        email,
        'Thank you for contacting United S.T.O.R.M. Basketball',
        `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,</p>
        <p>United S.T.O.R.M. Basketball Team</p>
        `
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!' 
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
}

// GET /api/contact - Get all contact messages (admin only)
export async function GET(req: Request, res: Response) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
}

// PUT /api/contact/:id - Mark message as read (admin only)
export async function PUT(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
}

// DELETE /api/contact/:id - Delete contact message (admin only)
export async function DELETE(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
} 