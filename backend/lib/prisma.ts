import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma: PrismaClient | undefined;

// Create a singleton Prisma client instance
function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    prisma = new PrismaClient({
      log: ['error', 'warn'], // Only log errors and warnings
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
    
    // Handle connection cleanup
    process.on('beforeExit', async () => {
      await prisma?.$disconnect();
    });
    
    process.on('SIGINT', async () => {
      await prisma?.$disconnect();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await prisma?.$disconnect();
      process.exit(0);
    });
  }
  
  return prisma;
}

// Export the function to get the Prisma client
export { getPrismaClient };

// Export the default client for backward compatibility
export default getPrismaClient(); 