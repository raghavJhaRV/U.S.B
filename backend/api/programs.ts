import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const GET = async (_req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { season: 'asc' },
    });

    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

export async function POST(req: any, res: any) {
  try {
    const { name, description, season, price } = req.body;

    if (!name || !season || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const program = await prisma.program.create({
      data: { name, description, season, price: parseFloat(price) },
    });

    res.status(201).json(program);
  } catch (error: any) {
    console.error('Create Program Error:', error);
    res.status(500).json({ error: 'Failed to create program' });
  }
}

export async function DELETE(req: any, res: any) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing program ID' });
    }

    await prisma.program.delete({ where: { id } });

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error: any) {
    console.error('Delete Program Error:', error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
}

export async function PUT(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description, season, price } = req.body;
  if (!name || !season || price === undefined) {
    return res.status(400).json({ error: 'Missing name, season or price' });
  }
  try {
    const updated = await prisma.program.update({
      where: { id },
      data: { name, description: description ?? '', season, price: parseFloat(price) },
    });
    return res.json(updated);
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'Program not found' });
    }
    console.error('Update Program Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}