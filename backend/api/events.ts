// src/api/events.ts
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '../lib/prisma';

// GET /api/events[?teamId=…]
export async function GET(req: Request, res: Response) {
  try {
    const where = req.query.teamId
      ? { teamId: String(req.query.teamId) }
      : undefined;

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { team: true },
    });

    return res.json(events);
  } catch (err) {
    console.error('Fetch events error:', err);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// POST /api/events
export async function POST(req: Request, res: Response) {
  const { 
    title, 
    description, 
    date, 
    startTime, 
    endTime, 
    location, 
    type, 
    teamId 
  } = req.body;
  
  console.log('Creating event:', { title, date, startTime, endTime, location, type, teamId });
  
  if (!title || !date || !startTime || !teamId) {
    return res.status(400).json({ error: 'Missing required fields: title, date, startTime, teamId' });
  }

  try {
    const created = await prisma.event.create({
      data: { 
        title, 
        description,
        date: new Date(date), 
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location,
        type: type || 'game',
        teamId 
      },
      include: { team: true }
    });
    return res.status(201).json(created);
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ error: 'Failed to create event' });
  }
}

// PUT /api/events/:id
export async function PUT(req: Request, res: Response) {
  const { id } = req.params;
  const { 
    title, 
    description, 
    date, 
    startTime, 
    endTime, 
    location, 
    type, 
    teamId 
  } = req.body;

  if (!title || !date || !startTime || !teamId) {
    return res.status(400).json({ error: 'Missing required fields: title, date, startTime, teamId' });
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location,
        type: type || 'game',
        teamId,
      },
      include: { team: true }
    });
    return res.json(updated);
  } catch (err: any) {
    console.error('Update event error:', err);
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.status(500).json({ error: 'Failed to update event' });
  }
}

// DELETE /api/events/:id
export async function DELETE(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.event.delete({ where: { id } });
    return res.json({ message: 'Event deleted' });
  } catch (err: any) {
    console.error('Delete event error:', err);
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.status(500).json({ error: 'Failed to delete event' });
  }
}
