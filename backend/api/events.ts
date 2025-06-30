import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET - already done
export async function GET(_req: Request) {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { team: true },
  });

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ✅ POST - create a new event
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, date, teamId } = body;

    if (!title || !date || !teamId) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const created = await prisma.event.create({
      data: { title, date: new Date(date), teamId },
    });

    return new Response(JSON.stringify(created), { status: 201 });
  } catch (error) {
    console.error('Create Event Error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}

// ✅ DELETE - delete event by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Event ID is required' }), { status: 400 });
    }

    await prisma.event.delete({ where: { id } });

    return new Response(JSON.stringify({ message: 'Event deleted' }), { status: 200 });
  } catch (error) {
    console.error('Delete Event Error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}
