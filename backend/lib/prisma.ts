import { PrismaClient } from '@prisma/client';

// Create a single Prisma client instance to be shared across the application
const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'], // Disable query logging to reduce prepared statement conflicts
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

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