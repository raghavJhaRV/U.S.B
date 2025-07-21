import prisma from '../lib/prisma';

export async function GET(_req: any, res: any) {
  try {
    const [registrations, teams, programs, events] = await Promise.all([
      prisma.registration.count(),
      prisma.team.count(),
      prisma.program.count(),
      prisma.event.count(),
    ]);

    res.status(200).json({
      registrations,
      teams,
      programs,
      events,
    });
  } catch (error: any) {
    console.error('Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
