# Helcim Payment Integration Setup Guide

## 🚀 Overview
This guide will help you set up Helcim payments for merchandise purchases and registration fees in your U.S.B application. Helcim is a Canadian payment processor that offers competitive rates and no transaction fees for customers.

## ✅ Helcim Advantages
- **No customer transaction fees** - Customers don't pay extra fees
- **Secure card storage** - PCI compliant tokenization
- **Canadian-based** - Better rates and support for Canadian businesses
- **Built-in fraud protection** - Advanced security features
- **Competitive rates** - Lower processing fees than many competitors

## 📋 Prerequisites
1. Helcim merchant account (sign up at https://helcim.com)
2. Access to your Render dashboard
3. Your application deployed and running

## 🔧 Step 1: Helcim Account Setup

### 1.1 Create Helcim Account
1. Go to https://helcim.com and sign up for a merchant account
2. Complete your business verification
3. Navigate to the Helcim Dashboard

### 1.2 Get API Credentials
1. In Helcim Dashboard, go to **Settings** → **API Access**
2. Copy your **Account ID**
3. Generate an **API Token**
4. **Important**: Use test credentials for development, live credentials for production

### 1.3 API Configuration
- **Test API URL**: `https://api.helcim.com/api/v1`
- **Live API URL**: `https://api.helcim.com/api/v1` (same URL for both)

## 🔧 Step 2: Environment Variables

### 2.1 Backend Environment Variables (Render)
Add these to your backend service environment variables:

```bash
# Helcim Configuration
HELCIM_API_URL=https://api.helcim.com/api/v1
HELCIM_ACCOUNT_ID=your_helcim_account_id_here
HELCIM_API_TOKEN=your_helcim_api_token_here

# Remove Stripe variables (if you had them)
# STRIPE_SECRET_KEY=...
# STRIPE_WEBHOOK_SECRET=...
```

### 2.2 Frontend Environment Variables (Render)
No additional frontend environment variables needed for Helcim!

## 🔧 Step 3: Test the Integration

### 3.1 Test Card Numbers
Use these Helcim test card numbers:
- **Success**: `4111111111111111`
- **Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`

### 3.2 Test the Payment Flow
1. Add items to cart (merchandise)
2. Go through checkout process
3. Use test card numbers
4. Verify payment appears in Helcim Dashboard

## 🔧 Step 4: Production Setup

### 4.1 Switch to Live Credentials
1. In Helcim Dashboard, switch to **Live** mode
2. Get your live API credentials
3. Update environment variables with live credentials

### 4.2 Security Best Practices
- Never log card details
- Always use HTTPS in production
- Keep API credentials secure
- Regularly rotate API tokens

## 🛒 Merchandise Payment Flow

### How it works:
1. User adds items to cart
2. User proceeds to checkout
3. Frontend sends payment data to `/api/payments/process`
4. Backend processes payment with Helcim
5. Payment is confirmed and order is saved
6. Card can be saved for future use (optional)

## 🏀 Registration Payment Flow

### How it works:
1. User fills out registration form
2. User proceeds to payment
3. Frontend sends payment data to `/api/payments/process`
4. Backend processes payment with Helcim
5. Payment is confirmed and registration is created
6. Registration is saved to database

## 💳 Card Storage Features

### Save Card for Future Use
- Users can opt to save their card securely
- Cards are tokenized and stored by Helcim
- Users can use saved cards for future purchases
- No card data stored on your servers

### Saved Card Management
- Users can view their saved cards
- Users can delete saved cards
- Cards are automatically masked for security

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
- Helcim Transaction ID
- Customer information
- Payment metadata

## 🔒 Security Features

### Implemented Security:
- Helcim handles all card data (PCI compliant)
- Card tokenization for secure storage
- Encrypted API communication
- Secure payment processing

### Best Practices:
- Never log card details
- Always use HTTPS in production
- Keep API credentials secure
- Regular security audits

## 🚨 Troubleshooting

### Common Issues:

1. **Payment Processing Fails**
   - Check Helcim credentials
   - Verify amount format (cents)
   - Check API endpoint URL
   - Review Helcim dashboard for errors

2. **Card Storage Issues**
   - Verify customer email is provided
   - Check Helcim card tokenization settings
   - Review API response for errors

3. **API Connection Issues**
   - Verify API URL is correct
   - Check account ID and token
   - Ensure proper authentication headers

## 📞 Support

If you encounter issues:
1. Check Helcim Dashboard for transaction status
2. Review server logs for errors
3. Test with Helcim's test cards
4. Contact Helcim support if needed

## 🔄 Updates and Maintenance

### Regular Tasks:
- Monitor payment success rates
- Review failed payments
- Update Helcim SDK versions
- Test payment functionality

### Security Updates:
- Rotate API tokens periodically
- Monitor for suspicious activity
- Keep dependencies updated

## 💰 Pricing Information

### Helcim Pricing (Typical):
- **Transaction Fee**: 2.5% + $0.10 per transaction
- **Monthly Fee**: $0 (no monthly fees)
- **Setup Fee**: $0 (no setup fees)
- **Customer Fees**: $0 (no fees charged to customers)

### Cost Comparison:
- **Stripe**: 2.9% + $0.30 per transaction
- **Helcim**: 2.5% + $0.10 per transaction
- **Savings**: ~0.4% + $0.20 per transaction

## 🎯 Migration from Stripe

### If migrating from Stripe:
1. Update environment variables
2. Replace payment form components
3. Update API endpoints
4. Test thoroughly with test cards
5. Update documentation

### Backward Compatibility:
- Legacy Stripe endpoints are still available
- Gradual migration is possible
- Both systems can coexist during transition

## 📝 Testing Checklist

- [ ] Frontend loads without errors
- [ ] Payment form displays correctly
- [ ] Test payments succeed with valid cards
- [ ] Test payments fail with invalid cards
- [ ] Card storage works correctly
- [ ] Saved cards can be used for payments
- [ ] Payment history is recorded
- [ ] Admin dashboard shows payments
- [ ] Error handling works for failed payments
- [ ] Security features are working

## 🚀 Getting Started

1. **Sign up for Helcim** at https://helcim.com
2. **Get your API credentials** from the dashboard
3. **Update environment variables** in Render
4. **Test the integration** with test cards
5. **Go live** with real credentials

Your U.S.B application is now ready to process payments with Helcim! 🏀💳 