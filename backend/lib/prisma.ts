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

// Add middleware to handle prepared statement conflicts
prisma.$use(async (params, next) => {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await next(params);
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a prepared statement conflict
      if (error?.code === 'P2010' && error?.meta?.code === '42P05') {
        console.log(`🔄 Prepared statement conflict on attempt ${attempt}, retrying...`);
        
        if (attempt < maxRetries) {
          // Wait with exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // If it's not a prepared statement conflict or we've exhausted retries, throw the error
      throw error;
    }
  }
  
  throw lastError;
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