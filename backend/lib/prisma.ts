import { PrismaClient } from '@prisma/client';

// Create a single Prisma client instance to be shared across the application
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma; 