# Environment Setup Guide

## 🔧 Quick Setup for Local Development

### Frontend Environment (.env.local)

Create a file called `.env.local` in the `frontend` directory:

```bash
# Stripe Public Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API URL (Local Development)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend Environment (.env)

Create a file called `.env` in the `backend` directory:

```bash
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

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

## 🧪 Test Card Numbers for Stripe

### Successful Payments
- **Visa:** `4242424242424242`
- **Visa (debit):** `4000056655665556`
- **Mastercard:** `5555555555554444`
- **American Express:** `378282246310005`

### Failed Payments
- **Card declined:** `4000000000000002`
- **Insufficient funds:** `4000000000009995`
- **Expired card:** `4000000000000069`
- **Incorrect CVC:** `4000000000000127`

### Test Details for All Cards
- **Expiry Date:** Any future date (e.g., `12/25`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP Code:** Any 5 digits (e.g., `12345`)

## 🚀 How to Use

1. **Get your Stripe test keys** from your Stripe dashboard
2. **Copy the environment variables** above to your respective `.env` files
3. **Replace the placeholder values** with your actual keys and credentials
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

- These are **test keys only** - they won't process real payments
- Test cards work in Stripe's test mode only
- You can safely use these for development and testing
- For production, use real Stripe keys from your Stripe dashboard

## 🔗 Useful Links

- **Stripe Test Dashboard:** https://dashboard.stripe.com/test
- **Stripe Test Webhooks:** https://dashboard.stripe.com/test/webhooks
- **Stripe Test Payments:** https://dashboard.stripe.com/test/payments

## 📝 Testing Checklist

- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Payment forms display properly
- [ ] Test payments succeed with valid cards
- [ ] Test payments fail with invalid cards
- [ ] Webhooks are received (check Stripe dashboard)
- [ ] Database records are created for successful payments
- [ ] Error handling works for failed payments 