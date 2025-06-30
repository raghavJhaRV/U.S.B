import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { sendMail } from '../mailer';

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
      },
    });

    // ✅ Send registration confirmation email
    await sendMail(
      email,
      'Registration Confirmation - United S.T.O.R.M.',
      `<p>Hi ${playerName},</p>
      <p>You have successfully registered for the program. We will contact you soon with more details.</p>
      <p>Thank you,<br>United S.T.O.R.M. Basketball</p>`
    );

    res.status(201).json(registration);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
