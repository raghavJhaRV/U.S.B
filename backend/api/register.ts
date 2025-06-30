import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { sendMail, sendRegistrationConfirmation } from '../mailer';

const prisma = new PrismaClient();

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

    if (!playerName || !email || !teamId || !programId) {
      return res.status(400).json({ error: 'Missing fields' });
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


    // ✅ Send registration confirmation email
    await sendRegistrationConfirmation(email, playerName, eTransferNote);


    res.status(201).json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
