import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export async function GET() {

  try {
    const registrations = await prisma.registration.findMany({
      include: {
        team: true,
        program: true,
        payment: true,
      },
    });

    const formatted = registrations.map((r) => ({
      Player: r.playerName,
      Parent: r.parentName,
      Email: r.email,
      Phone: r.phone,
      WaiverURL: r.waiverUrl || '',
      Team: r.team ? `${r.team.gender.toUpperCase()} - ${r.team.ageGroup}` : '',
      Program: r.program?.name || '',
      Price: r.program?.price?.toFixed(2) || '',
      PaymentAmount: r.payment?.amount?.toFixed(2) || '',
      PaymentMethod: r.payment?.method || '',
      ETransferNote: r.eTransferNote || '',
      CreatedAt: r.createdAt.toISOString(),
    }));

    const parser = new Parser();
    const csv = parser.parse(formatted);

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=registrations.csv',
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return new Response('Failed to export CSV', { status: 500 });
  }
}
