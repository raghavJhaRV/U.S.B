// backend/api/news.ts
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// GET all news items (public endpoint)
export const GET = async (_req: Request, res: Response) => {
  try {
    const newsList = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' } // Order by newest first
    });
    res.json(newsList);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

// POST route to create a new news item
export async function POST(req: Request, res: Response) {
  const { title, content, imageUrl } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    const newNews = await prisma.news.create({
      data: { title, content, imageUrl }
    });
    return res.status(201).json(newNews);
  } catch (err: unknown) { // Using 'unknown' for better type safety
    console.error('Error creating news:', err);
    return res.status(500).json({ error: 'Failed to create news item.' });
  }
}

// PUT route to update a news item
export async function PUT(req: Request, res: Response) {
  const { id } = req.params;
  const { title, content, imageUrl } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'News ID is required.' });
  }

  // Allow partial updates: only update fields that are provided
  const updateData: { title?: string; content?: string; imageUrl?: string | null } = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }

  try {
    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData
    });
    return res.json(updatedNews);
  } catch (err: unknown) { // Using 'unknown' for better type safety
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'News item not found.' });
    }
    console.error('Error updating news:', err);
    return res.status(500).json({ error: 'Failed to update news item.' });
  }
}

// DELETE route to delete a news item
export async function DELETE(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'News ID is required.' });
  }

  try {
    await prisma.news.delete({ where: { id } });
    return res.status(204).send(); // No content for successful deletion
  } catch (err: unknown) { // Using 'unknown' for better type safety
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: 'News item not found.' });
    }
    console.error('Error deleting news:', err);
    return res.status(500).json({ error: 'Failed to delete news item.' });
  }
}