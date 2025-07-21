# 🔧 U.S.B Backend Troubleshooting Guide

## 🚨 Current Issue: 500 Errors on API Endpoints

Your backend is experiencing 500 errors on multiple endpoints:
- `/api/teams` - 500 error
- `/api/events` - 500 error  
- `/api/registrations` - 500 error
- `/api/programs` - 500 error
- `/api/payments` - 500 error

## 🔍 Root Cause Analysis

The 500 errors are caused by **database connection failures**. Your backend server is running but cannot connect to the Supabase PostgreSQL database.

## 🛠️ Step-by-Step Fix

### 1. Check Render Environment Variables

Go to your Render dashboard:
1. Navigate to your backend service (`usb-backend`)
2. Click on "Environment" tab
3. Verify these variables are set:

```
DATABASE_URL=postgresql://postgres:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://bratlcnxybxyydxnnimr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
HELCIM_API_URL=https://api.helcim.com/api/v1
HELCIM_ACCOUNT_ID=[your-account-id]
HELCIM_API_TOKEN=[your-api-token]
NODE_ENV=production
```

### 2. Test Database Connection

Run these commands to test your backend:

```bash
# Test health endpoint
curl https://usb-backend.onrender.com/api/health

# Test database connection specifically
curl https://usb-backend.onrender.com/api/test-db
```

### 3. Check Render Logs

1. Go to your Render dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for error messages like:
   - "Database connection failed"
   - "ECONNREFUSED"
   - "Authentication failed"

### 4. Verify Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Database" → "Settings"
4. Check if database is active
5. Verify connection string format

### 5. Common Issues & Solutions

#### Issue: Invalid DATABASE_URL format
**Solution:** Ensure your DATABASE_URL follows this format:
```
postgresql://postgres:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

#### Issue: Wrong password in DATABASE_URL
**Solution:** 
1. Go to Supabase Dashboard
2. Database → Settings → Database Password
3. Reset password if needed
4. Update DATABASE_URL in Render

#### Issue: Supabase project paused
**Solution:**
1. Check Supabase billing
2. Resume project if paused
3. Wait for database to become active

#### Issue: Network connectivity
**Solution:**
1. Try direct database URL instead of pooler
2. Update DATABASE_URL to use direct connection:
```
postgresql://postgres:[password]@db.bratlcnxybxyydxnnimr.supabase.co:5432/postgres
```

### 6. Quick Fix Commands

If you need to update environment variables quickly:

```bash
# Test current status
curl -s https://usb-backend.onrender.com/api/health | jq

# Check if backend is responding
curl -I https://usb-backend.onrender.com/api/health
```

### 7. Emergency Fallback

If database issues persist, you can temporarily use a different database:

1. Create a new Supabase project
2. Run migrations on new database
3. Update DATABASE_URL in Render
4. Test endpoints

## 📊 Monitoring

After fixing, monitor these endpoints:
- `GET /api/health` - Overall system health
- `GET /api/test-db` - Database connection
- `GET /api/teams` - Basic data access
- `GET /api/events` - Event data access

## 🆘 Still Having Issues?

1. **Check Render logs** for detailed error messages
2. **Verify Supabase project** is active and accessible
3. **Test database connection** using Supabase dashboard
4. **Contact support** if issues persist

## ✅ Success Indicators

When fixed, you should see:
- ✅ All API endpoints returning 200 status
- ✅ No more 500 errors in browser console
- ✅ Data loading properly on frontend
- ✅ Admin panel working correctly

---

**Last Updated:** $(date)
**Status:** Database connection issue - needs environment variable verification 