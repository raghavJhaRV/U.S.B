import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const GET = async (_req: Request, res: Response) => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        team: true,
        program: true,
      },
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};

export async function DELETE(req: any, res: any) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing registration ID' });
    }

    await prisma.registration.delete({ where: { id } });

    res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (error: any) {
    console.error('Delete Registration Error:', error);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
}