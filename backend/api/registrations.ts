import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const GET = async (_req: Request, res: Response) => {
  try {
    const regs = await prisma.registration.findMany({
      include: {
        team: { select: { gender: true, ageGroup: true } },
        program: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // flatten for convenience
    const formatted = regs.map(r => ({
      ...r,
      teamLabel: `${r.team.gender.toUpperCase()} — ${r.team.ageGroup}`,
      programName: r.program.name,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching registrations:', err);
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

export async function PUT(req: Request, res: Response) {
  const { id } = req.params;
  const {
    playerName,
    parentName,
    email,
    phone,
    waiverUrl,
    eTransferNote,
    programId,
    teamId,
  } = req.body as {
    playerName?: string;
    parentName?: string;
    email?: string;
    phone?: string;
    waiverUrl?: string | null;
    eTransferNote?: string;
    programId?: string;
    teamId?: string;
  };

  if (!id) {
    return res.status(400).json({ error: 'Missing registration ID' });
  }

  // Build only the fields that were actually provided
  const data: Prisma.RegistrationUpdateInput = {};
  if (playerName  !== undefined) data.playerName   = playerName;
  if (parentName  !== undefined) data.parentName   = parentName;
  if (email       !== undefined) data.email        = email;
  if (phone       !== undefined) data.phone        = phone;
  if (waiverUrl   !== undefined) data.waiverUrl    = waiverUrl;
  if (eTransferNote !== undefined) data.eTransferNote = eTransferNote;
  if (programId   !== undefined) data.program = { connect: { id: programId } };
  if (teamId      !== undefined) data.team = { connect: { id: teamId } };

  try {
    const updated = await prisma.registration.update({
      where: { id },
      data,
    });
    return res.json(updated);
  } catch (err: any) {
    console.error('Update Registration Error:', err);
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    return res
      .status(500)
      .json({ error: err.message || 'Failed to update registration' });
  }
}