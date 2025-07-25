import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const POST = async (req: Request, res: Response) => {
  try {
    console.log('Test registration request body:', req.body);
    
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

    // Test database connection
    const team = await prisma.team.findUnique({
      where: { id: teamId }
    });
    
    const program = await prisma.program.findUnique({
      where: { id: programId }
    });

    console.log('Found team:', team);
    console.log('Found program:', program);

    if (!team) {
      return res.status(400).json({ error: 'Team not found' });
    }

    if (!program) {
      return res.status(400).json({ error: 'Program not found' });
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

    console.log('Registration created:', registration);
    res.status(201).json(registration);
  } catch (error) {
    console.error('Test registration error:', error);
    res.status(500).json({ 
      error: 'Something went wrong', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}; 