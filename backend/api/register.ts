import { Request, Response } from 'express';
import { sendMail, sendRegistrationConfirmation, sendAdminRegistrationNotification } from '../lib/mailer';
import prisma from '../lib/prisma';

export const POST = async (req: Request, res: Response) => {
  try {
    const {
      playerName,
      parentName,
      email,
      phone,
      waiverAccepted,
      teamId,
      programId,
      eTransferNote,
    } = req.body;

    if (!playerName || !parentName || !email || !phone || !teamId || !programId) {
      return res.status(400).json({ error: 'Missing required fields: playerName, parentName, email, phone, teamId, programId' });
    }

    const registration = await prisma.registration.create({
      data: {
        playerName,
        parentName,
        email,
        phone,
        waiverAccepted,
        teamId,
        programId,
        eTransferNote,
      },
    });

    // ✅ Send registration confirmation email to user (optional - don't block registration)
    if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
      try {
        await sendRegistrationConfirmation(email, playerName, eTransferNote);
      } catch (emailError) {
        console.warn('Failed to send registration confirmation email:', emailError);
      }
    } else {
      console.log('Email credentials not configured, skipping confirmation email');
    }

    // ✅ Send admin notification email (optional - don't block registration)
    if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD && process.env.ADMIN_EMAIL) {
      try {
        await sendAdminRegistrationNotification(registration);
      } catch (emailError) {
        console.warn('Failed to send admin notification email:', emailError);
      }
    } else {
      console.log('Email credentials not configured, skipping admin notification');
    }

    res.status(201).json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body
    });
    res.status(500).json({ error: 'Something went wrong', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};
