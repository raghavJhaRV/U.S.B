# Environment Setup Guide

## 🔧 Quick Setup for Local Development

### Frontend Environment (.env.local)

Create a file called `.env.local` in the `frontend` directory:

```bash
# API URL (Local Development)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend Environment (.env)

Create a file called `.env` in the `backend` directory:

```bash
# Helcim Configuration (Test Mode)
HELCIM_API_URL=https://api.helcim.com/api/v1
HELCIM_ACCOUNT_ID=your_helcim_account_id_here
HELCIM_API_TOKEN=your_helcim_api_token_here

# Database Configuration (Replace with your actual values)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
DIRECT_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# Authentication (Replace with your actual values)
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_PASSWORD=your_admin_password_here

# Supabase Configuration (Replace with your actual values)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Environment
NODE_ENV=development
```

## 🧪 Test Card Numbers for Helcim

### Successful Payments
- **Visa:** `4111111111111111`
- **Mastercard:** `5555555555554444`
- **American Express:** `378282246310005`

### Failed Payments
- **Card declined:** `4000000000000002`
- **Insufficient funds:** `4000000000009995`
- **Expired card:** `4000000000000069`

### Test Details for All Cards
- **Expiry Date:** Any future date (e.g., `12/25`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP Code:** Any 5 digits (e.g., `12345`)

## 🚀 How to Use

1. **Get your Helcim credentials** from your Helcim dashboard
2. **Copy the environment variables** above to your respective `.env` files
3. **Replace the placeholder values** with your actual credentials
4. **Start your development servers**:
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```
5. **Test payments** using the test card numbers above

## ⚠️ Important Notes

- These are **test credentials only** - they won't process real payments
- Test cards work in Helcim's test mode only
- You can safely use these for development and testing
- For production, use real Helcim credentials from your Helcim dashboard

## 🔗 Useful Links

- **Helcim Dashboard:** https://app.helcim.com
- **Helcim API Documentation:** https://api.helcim.com/docs
- **Helcim Support:** https://helcim.com/support

## 📝 Testing Checklist

- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Payment forms display properly
- [ ] Test payments succeed with valid cards
- [ ] Test payments fail with invalid cards
- [ ] Webhooks are received (check Stripe dashboard)
- [ ] Database records are created for successful payments
- [ ] Error handling works for failed payments 