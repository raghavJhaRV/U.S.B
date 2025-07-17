// backend/api/merchandise.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client'; // Assuming prisma is imported directly or passed

const router = Router();
const prisma = new PrismaClient(); // Or import from server.ts if exported

// GET all merchandise
router.get('/', async (req, res) => {
  try {
    const merchandise = await prisma.merchandise.findMany();
    res.json(merchandise);
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    res.status(500).json({ error: 'Failed to fetch merchandise' });
  }
});

// POST new merchandise
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl, stock, category, isActive } = req.body;
  try {
    const newMerchandise = await prisma.merchandise.create({
      data: {
        name,
        description,
        price: parseFloat(price), // Ensure price is parsed to float
        imageUrl,
        stock: parseInt(stock), // Ensure stock is parsed to int
        category,
        isActive,
      },
    });
    res.status(201).json(newMerchandise);
  } catch (error) {
    console.error('Error creating merchandise:', error);
    res.status(500).json({ error: 'Failed to create merchandise' });
  }
});

// PUT update merchandise
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, stock, category, isActive } = req.body;
  try {
    const updatedMerchandise = await prisma.merchandise.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        imageUrl,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        category,
        isActive,
      },
    });
    res.json(updatedMerchandise);
  } catch (error) {
    console.error('Error updating merchandise:', error);
    res.status(500).json({ error: 'Failed to update merchandise' });
  }
});

// DELETE merchandise
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.merchandise.delete({
      where: { id },
    });
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error deleting merchandise:', error);
    res.status(500).json({ error: 'Failed to delete merchandise' });
  }
});

export default router;