import { PrismaClient } from '@prisma/client';

// Create a single Prisma client instance to be shared across the application
const prisma = new PrismaClient({
  log: ['warn', 'error'], // Disable all query logging to reduce prepared statement conflicts
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Temporarily disable middleware to avoid prepared statement conflicts
console.log('⚠️ Prisma middleware temporarily disabled to avoid prepared statement conflicts');

// Handle connection cleanup on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Handle process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma; 