import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const GET = async (_req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export async function POST(req: Request, res: Response) {
  const { gender, ageGroup } = req.body;
  if (!gender || !ageGroup) {
    return res.status(400).json({ error: 'Missing gender or ageGroup' });
  }

  try {
    const team = await prisma.team.create({
      data: { gender, ageGroup },
    });
    return res.status(201).json(team);
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'This team already exists.' });
    }
    console.error('Create Team Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing team ID' });
      return;
    }

    await prisma.team.delete({ where: { id } });
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (err: any) {
    // <— Add this block to handle foreign-key violations
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2003') {
      res.status(409).json({ error: 'Cannot delete team: it has registrations.' });
      return;
    }
    // — end block

    console.error('Delete Team Error:', err);
    res.status(500).json({ error: 'Failed to delete team' });
  }
}

export async function PUT(req: Request, res: Response) {
  const { id } = req.params;
  const { gender, ageGroup } = req.body;

  if (!id || !gender || !ageGroup) {
    return res.status(400).json({ error: 'Missing id, gender or ageGroup' });
  }

  try {
    const team = await prisma.team.update({
      where: { id },
      data: { gender, ageGroup },
    });
    return res.json(team);
  } catch (err: any) {
    // record not found
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'Team not found' });
    }
    // unique constraint
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'This team already exists.' });
    }
    console.error('Update Team Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}