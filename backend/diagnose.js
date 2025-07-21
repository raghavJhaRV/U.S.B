// Diagnostic script for U.S.B Backend
// Run this locally to check your environment setup

require('dotenv').config();

console.log('🔍 U.S.B Backend Diagnostic Tool');
console.log('================================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('DIRECT_DATABASE_URL:', process.env.DIRECT_DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('HELCIM_API_URL:', process.env.HELCIM_API_URL ? '✅ Set' : '❌ Missing');
console.log('HELCIM_ACCOUNT_ID:', process.env.HELCIM_ACCOUNT_ID ? '✅ Set' : '❌ Missing');
console.log('HELCIM_API_TOKEN:', process.env.HELCIM_API_TOKEN ? '✅ Set' : '❌ Missing');

// Check database URL format
if (process.env.DATABASE_URL) {
  console.log('\n🔗 Database URL Analysis:');
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl.includes('pooler')) {
    console.log('📊 Using Supabase Pooler URL');
    console.log('   Host: aws-0-us-west-1.pooler.supabase.com:6543');
  } else if (dbUrl.includes('db.bratlcnxybxyydxnnimr.supabase.co')) {
    console.log('📊 Using Direct Supabase URL');
    console.log('   Host: db.bratlcnxybxyydxnnimr.supabase.co');
  } else {
    console.log('📊 Using Custom Database URL');
  }
  
  // Check if it's a valid PostgreSQL URL
  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    console.log('✅ Valid PostgreSQL URL format');
  } else {
    console.log('❌ Invalid database URL format');
  }
}

console.log('\n🚀 Next Steps:');
console.log('1. Check your Render environment variables');
console.log('2. Ensure DATABASE_URL is correctly formatted');
console.log('3. Test database connection with: curl https://usb-backend.onrender.com/api/test-db');
console.log('4. Check health status with: curl https://usb-backend.onrender.com/api/health');

console.log('\n📞 If issues persist:');
console.log('- Check Render logs for detailed error messages');
console.log('- Verify Supabase database is active and accessible');
console.log('- Ensure all environment variables are set in Render dashboard'); 