import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

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