import { PrismaClient } from '@prisma/client';

// Create a single Prisma client instance to be shared across the application
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=5&pool_timeout=20',
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

// Add error handling for prepared statement conflicts
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error: any) {
    if (error?.code === 'P2010' && error?.meta?.code === '42P05') {
      // Prepared statement already exists - try to reconnect
      console.log('🔄 Prepared statement conflict detected, attempting to reconnect...');
      await prisma.$disconnect();
      await prisma.$connect();
      // Retry the query once
      return await next(params);
    }
    throw error;
  }
});

export default prisma; 