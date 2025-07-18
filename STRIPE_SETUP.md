# Stripe Payment Integration Setup Guide

## 🚀 Overview
This guide will help you set up Stripe payments for merchandise purchases and registration fees in your U.S.B application.

## 📋 Prerequisites
1. Stripe account (sign up at https://stripe.com)
2. Access to your Render dashboard
3. Your application deployed and running

## 🔧 Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to https://stripe.com and sign up
2. Complete your business verification
3. Navigate to the Stripe Dashboard

### 1.2 Get API Keys
1. In Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)
4. **Important**: Use test keys for development, live keys for production

### 1.3 Set Up Webhook
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://your-backend-url.onrender.com/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)

## 🔧 Step 2: Environment Variables

### 2.1 Backend Environment Variables (Render)
Add these to your backend service environment variables:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2.2 Frontend Environment Variables (Render)
Add this to your frontend service environment variables:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 🔧 Step 3: Test the Integration

### 3.1 Test Card Numbers
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### 3.2 Test the Payment Flow
1. Add items to cart (merchandise)
2. Go through checkout process
3. Use test card numbers
4. Verify payment appears in Stripe Dashboard

## 🔧 Step 4: Production Setup

### 4.1 Switch to Live Keys
1. In Stripe Dashboard, switch to **Live** mode
2. Get your live API keys
3. Update environment variables with live keys
4. Update webhook endpoint URL to production URL

### 4.2 Update Webhook
1. Update webhook endpoint to production URL
2. Test webhook delivery
3. Verify events are being received

## 🛒 Merchandise Payment Flow

### How it works:
1. User adds items to cart
2. User proceeds to checkout
3. Frontend creates payment intent via `/api/payments/merchandise`
4. User enters card details
5. Payment is processed through Stripe
6. Payment is confirmed via `/api/payments/confirm`
7. Order is saved to database

## 🏀 Registration Payment Flow

### How it works:
1. User fills out registration form
2. User proceeds to payment
3. Frontend creates payment intent via `/api/payments/registration`
4. User enters card details
5. Payment is processed through Stripe
6. Payment is confirmed and registration is created
7. Registration is saved to database

## 📊 Payment Tracking

### Admin Dashboard
- View all payments in admin dashboard
- Track payment status
- View customer information
- Export payment data

### Database Schema
Payments are stored with:
- Amount (in cents)
- Currency
- Status
- Stripe Payment Intent ID
- Customer information
- Payment metadata

## 🔒 Security Features

### Implemented Security:
- Stripe handles all card data (PCI compliant)
- Webhook signature verification
- Payment intent confirmation
- Secure API endpoints

### Best Practices:
- Never log card details
- Always verify webhook signatures
- Use HTTPS in production
- Keep API keys secure

## 🚨 Troubleshooting

### Common Issues:

1. **Payment Intent Creation Fails**
   - Check Stripe secret key
   - Verify amount format (cents)
   - Check API endpoint URL

2. **Webhook Not Receiving Events**
   - Verify webhook URL is accessible
   - Check webhook secret
   - Test webhook delivery in Stripe Dashboard

3. **Frontend Payment Form Not Loading**
   - Check publishable key
   - Verify Stripe.js is loaded
   - Check browser console for errors

4. **Payment Confirmation Fails**
   - Verify payment intent status
   - Check database connection
   - Review server logs

## 📞 Support

If you encounter issues:
1. Check Stripe Dashboard for payment status
2. Review server logs for errors
3. Test with Stripe's test cards
4. Contact Stripe support if needed

## 🔄 Updates and Maintenance

### Regular Tasks:
- Monitor payment success rates
- Review failed payments
- Update Stripe SDK versions
- Test webhook functionality

### Security Updates:
- Rotate API keys periodically
- Monitor for suspicious activity
- Keep dependencies updated 