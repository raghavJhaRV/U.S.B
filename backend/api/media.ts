// backend/api/media.ts
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET all media items (public)
export const GET = async (_req: Request, res: Response) => {
  try {
    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(mediaList);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

// POST route to create a new media item (Admin Protected)
export async function POST(req: Request, res: Response) {
  const { title, url, type } = req.body;
  if (!title || !url || !type) {
    return res.status(400).json({ error: 'Title, URL, and type are required.' });
  }

  try {
    const newMedia = await prisma.media.create({
      data: { title, url, type }
    });
    return res.status(201).json(newMedia);
  } catch (err: unknown) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        return res.status(409).json({ error: 'Media with this URL already exists.' });
    }
    console.error('Error creating media:', err);
    return res.status(500).json({ error: 'Failed to create media item.' });
  }
}

// PUT route to update a media item (Admin Protected)
export async function PUT(req: Request, res: Response) {
  const { id } = req.params;
  const { title, url, type } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Media ID is required.' });
  }

  const updateData: { title?: string; url?: string; type?: string } = {};
  if (title !== undefined) updateData.title = title;
  if (url !== undefined) updateData.url = url;
  if (type !== undefined) updateData.type = type;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const updatedMedia = await prisma.media.update({
      where: { id },
      data: updateData
    });
    return res.json(updatedMedia);
  } catch (err: unknown) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'Media item not found.' });
    }
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        return res.status(409).json({ error: 'Media with this URL already exists.' });
    }
    console.error('Error updating media:', err);
    return res.status(500).json({ error: 'Failed to update media item.' });
  }
}

// DELETE route to delete a media item (Admin Protected)
export async function DELETE(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Media ID is required.' });
  }

  try {
    await prisma.media.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'Media item not found.' });
    }
    console.error('Error deleting media:', err);
    return res.status(500).json({ error: 'Failed to delete media item.' });
  }
}