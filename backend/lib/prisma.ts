import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prisma: PrismaClient | undefined;

// Create a singleton Prisma client instance
function getPrismaClient(): PrismaClient {
  if (!prisma) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL environment variable is not set');
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('🔗 Initializing Prisma client with database URL:', dbUrl.replace(/:[^:@]*@/, ':****@'));
    
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
    
    // Test the connection
    prisma.$connect()
      .then(() => {
        console.log('✅ Prisma client connected successfully');
      })
      .catch((error) => {
        console.error('❌ Prisma client connection failed:', error);
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