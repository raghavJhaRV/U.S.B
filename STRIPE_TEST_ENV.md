# Stripe Test Environment Variables

## 🔑 Stripe Environment Variables for Testing

Use these placeholder environment variables as a template for your Stripe integration. Replace the placeholders with your actual test keys from your Stripe dashboard.

### Frontend Environment Variables (.env.local)

```bash
# Stripe Public Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API URL (Local Development)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend Environment Variables (.env)

```bash
# Stripe Secret Key (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Stripe Webhook Secret (Test Mode)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database URL (Your existing Supabase URL)
DATABASE_URL=your_existing_supabase_url_here

# Other existing variables...
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD=your_admin_password_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key_here
```

## 🧪 Test Card Numbers

When testing payments, you can use these Stripe test card numbers:

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
2. **Copy the environment variables** to your respective `.env` files
3. **Replace the placeholder values** with your actual keys and credentials
4. **Test payments** using the test card numbers above
5. **Monitor webhooks** in your Stripe dashboard

## ⚠️ Important Notes

- These are **placeholder values only** - replace with your actual test keys
- Test cards work in Stripe's test mode only
- Never commit real API keys to your repository
- For production, use real Stripe keys from your Stripe dashboard

## 🔗 Stripe Dashboard Links

- **Test Dashboard:** https://dashboard.stripe.com/test
- **Webhook Testing:** https://dashboard.stripe.com/test/webhooks
- **Payment Intents:** https://dashboard.stripe.com/test/payments

## 📝 Testing Checklist

- [ ] Frontend loads without errors
- [ ] Payment form displays correctly
- [ ] Test payments succeed with valid cards
- [ ] Test payments fail with invalid cards
- [ ] Webhooks are received (check Stripe dashboard)
- [ ] Database records are created for successful payments
- [ ] Error handling works for failed payments 