import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance for each request to avoid connection pooling issues
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: [], // Disable all logging
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// Export a function that creates a new client for each request
export async function getPrismaClient(): Promise<PrismaClient> {
  const client = createPrismaClient();
  
  // Handle connection cleanup
  process.on('beforeExit', async () => {
    await client.$disconnect();
  });
  
  process.on('SIGINT', async () => {
    await client.$disconnect();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await client.$disconnect();
    process.exit(0);
  });
  
  return client;
}

// Keep the default export for backward compatibility, but it will create a new instance
export default createPrismaClient(); 