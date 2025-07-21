const { execSync } = require('child_process');

console.log('🚀 Starting deployment migration...');

try {
  // Apply database migrations
  console.log('📊 Applying database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Deployment migration completed successfully!');
} catch (error) {
  console.error('❌ Deployment migration failed:', error.message);
  process.exit(1);
} 