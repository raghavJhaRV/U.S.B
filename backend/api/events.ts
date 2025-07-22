// src/api/events.ts
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getPrismaClient } from '../lib/prisma';

// GET /api/events[?teamId=…]
export async function GET(req: Request, res: Response) {
  try {
    console.log('🔍 Fetching events with query:', req.query);
    
    const where = req.query.teamId
      ? { teamId: String(req.query.teamId) }
      : undefined;

    console.log('📊 Database query where clause:', where);
    
    const prisma = getPrismaClient();
    console.log('✅ Prisma client obtained');
    
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { team: true },
    });

    console.log(`✅ Found ${events.length} events`);
    return res.json(events);
  } catch (err) {
    console.error('❌ Fetch events error:', err);
    console.error('🔍 Error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      code: (err as any)?.code,
      name: err instanceof Error ? err.name : undefined
    });
    
    // Provide more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to fetch events: ${err instanceof Error ? err.message : 'Unknown error'}`
      : 'Failed to fetch events';
      
    return res.status(500).json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}

// POST /api/events
export async function POST(req: Request, res: Response) {
  try {
    console.log('🔍 Creating event with body:', req.body);
    
    const { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      location, 
      type, 
      livestreamUrl,
      teamId 
    } = req.body;
    
    console.log('📊 Event data:', { title, date, startTime, endTime, location, type, livestreamUrl, teamId });
    
    if (!title || !date || !startTime || !teamId) {
      console.log('❌ Missing required fields:', { title: !!title, date: !!date, startTime: !!startTime, teamId: !!teamId });
      return res.status(400).json({ 
        error: 'Missing required fields: title, date, startTime, teamId',
        received: { title: !!title, date: !!date, startTime: !!startTime, teamId: !!teamId }
      });
    }

    console.log('✅ All required fields present, connecting to database...');
    const prisma = getPrismaClient();
    console.log('✅ Prisma client obtained');
    
    // Verify team exists
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId }
      });
      
      if (!team) {
        console.error('❌ Team not found:', teamId);
        return res.status(400).json({ 
          error: `Team with ID ${teamId} not found`,
          receivedTeamId: teamId
        });
      }
      
      console.log('✅ Team found:', team.gender, team.ageGroup);
    } catch (teamErr) {
      console.error('❌ Team lookup error:', teamErr);
      return res.status(500).json({ 
        error: 'Failed to verify team',
        details: process.env.NODE_ENV === 'development' ? teamErr.message : 'Database error'
      });
    }
    
    // Parse dates more robustly
    let parsedDate, parsedStartTime, parsedEndTime;
    
    try {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid date format: ${date}`);
      }
    } catch (dateErr) {
      console.error('❌ Date parsing error:', dateErr);
      return res.status(400).json({ 
        error: `Invalid date format: ${date}`,
        expected: 'YYYY-MM-DD format'
      });
    }
    
    try {
      parsedStartTime = new Date(startTime);
      if (isNaN(parsedStartTime.getTime())) {
        throw new Error(`Invalid start time format: ${startTime}`);
      }
    } catch (startTimeErr) {
      console.error('❌ Start time parsing error:', startTimeErr);
      return res.status(400).json({ 
        error: `Invalid start time format: ${startTime}`,
        expected: 'ISO date string or valid date format'
      });
    }
    
    if (endTime) {
      try {
        parsedEndTime = new Date(endTime);
        if (isNaN(parsedEndTime.getTime())) {
          console.warn('⚠️ Invalid end time format, setting to null:', endTime);
          parsedEndTime = null;
        }
      } catch (endTimeErr) {
        console.warn('⚠️ End time parsing error, setting to null:', endTimeErr);
        parsedEndTime = null;
      }
    }
    
    const eventData = { 
      title, 
      description,
      date: parsedDate, 
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      location,
      type: type || 'game',
      livestreamUrl,
      teamId 
    };
    
    console.log('📝 Creating event with data:', eventData);
    
    const created = await prisma.event.create({
      data: eventData,
      include: { team: true }
    });
    
    console.log('✅ Event created successfully:', created.id);
    return res.status(201).json(created);
  } catch (err) {
    console.error('❌ Create event error:', err);
    console.error('🔍 Error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      code: (err as any)?.code,
      name: err instanceof Error ? err.name : undefined
    });
    
    // Provide more detailed error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to create event: ${err instanceof Error ? err.message : 'Unknown error'}`
      : 'Failed to create event';
      
    return res.status(500).json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
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
    livestreamUrl,
    teamId 
  } = req.body;

  if (!title || !date || !startTime || !teamId) {
    return res.status(400).json({ error: 'Missing required fields: title, date, startTime, teamId' });
  }

  try {
    const prisma = getPrismaClient();
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
        livestreamUrl,
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
    const prisma = getPrismaClient();
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
