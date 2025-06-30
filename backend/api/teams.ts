import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const GET = async (_req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export async function POST(req: any, res: any) {
  try {
    const { gender, ageGroup } = req.body;

    if (!gender || !ageGroup) {
      return res.status(400).json({ error: 'Missing gender or ageGroup' });
    }

    const team = await prisma.team.create({ data: { gender, ageGroup } });
    res.status(201).json(team);
  } catch (err: any) {
    console.error('Create Team Error:', err);
    res.status(500).json({ error: 'Failed to create team' });
  }
}

export async function DELETE(req: any, res: any) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing team ID' });
    }

    await prisma.team.delete({ where: { id } });

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    console.error('Delete Team Error:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
}
