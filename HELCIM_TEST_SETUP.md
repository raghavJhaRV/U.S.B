# Helcim Test Setup Guide

## 🧪 Quick Setup for Testing Without Real Helcim Credentials

You can now test the registration and payment system without setting up real Helcim credentials!

### ✅ What's Already Set Up

1. **Test Payment Endpoints**: 
   - `/api/test-payments/process` - Simulates payment processing
   - `/api/test-payments/saved-cards` - Returns mock saved cards

2. **Test Payment Form**: 
   - `HelcimPaymentFormTest.tsx` - Uses test endpoints
   - Shows test card numbers
   - Simulates payment scenarios

3. **Test Payment Scenarios**:
   - **Success**: `4111111111111111`
   - **Decline**: `4000000000000002`
   - **Insufficient Funds**: `4000000000009995`
   - **Expired Card**: `4000000000000069`

### 🚀 How to Test

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Registration Flow**:
   - Go to `/registration/boys` or `/registration/girls`
   - Fill out the registration form
   - Complete the registration
   - You'll be redirected to the payment page
   - Use the test card numbers above

### 🧪 Test Features

#### Payment Processing
- ✅ Simulates 1-second processing delay
- ✅ Creates real payment records in database
- ✅ Links payments to registrations
- ✅ Updates registration status to "paid"
- ✅ Handles different failure scenarios

#### Card Storage
- ✅ Simulates saving cards
- ✅ Shows mock saved cards
- ✅ Allows using saved cards for payments

#### Error Handling
- ✅ Tests card decline scenarios
- ✅ Tests insufficient funds
- ✅ Tests expired cards
- ✅ Shows appropriate error messages

### 📊 What Gets Created

When you make a test payment:

1. **Payment Record**: Created in the database with:
   - Amount (in cents)
   - Status: "completed"
   - Type: "registration"
   - Test metadata

2. **Registration Update**: 
   - Payment status updated to "paid"
   - Payment linked to registration

3. **Admin Dashboard**: 
   - Payment appears in admin panel
   - Can be exported with other registrations

### 🔄 Switching to Real Helcim Later

When you're ready to use real Helcim:

1. **Get Real Credentials**:
   - Sign up at https://helcim.com
   - Get your Account ID and API Token

2. **Update Environment Variables**:
   ```bash
   # In backend/.env
   HELCIM_API_URL=https://api.helcim.com/api/v1
   HELCIM_ACCOUNT_ID=your_real_account_id
   HELCIM_API_TOKEN=your_real_api_token
   ```

3. **Switch Payment Forms**:
   - Replace `HelcimPaymentFormTest` with `HelcimPaymentForm`
   - Update API endpoints from `/api/test-payments/` to `/api/payments/`

### 🎯 Benefits of This Setup

- **No Real Money**: Test with confidence
- **Full Functionality**: All features work as expected
- **Real Database**: Payments are actually stored
- **Easy Switching**: Simple to switch to real payments later
- **Development Friendly**: No need for real credentials during development

### 🚨 Important Notes

- **Test Mode Indicator**: The payment form clearly shows it's in test mode
- **No Real Charges**: No actual money is processed
- **Database Impact**: Test payments are stored in your real database
- **Admin Visibility**: Test payments appear in admin dashboard

### 🧹 Cleaning Up Test Data

If you want to clean up test payments later:

```sql
-- Remove test payments
DELETE FROM "Payment" WHERE metadata->>'isTestPayment' = 'true';

-- Reset registration payment status
UPDATE "Registration" 
SET "paymentStatus" = 'pending', "paymentId" = NULL 
WHERE "paymentId" IN (
  SELECT id FROM "Payment" WHERE metadata->>'isTestPayment' = 'true'
);
```

### 🎉 Ready to Test!

You can now test the complete registration and payment flow without any real Helcim setup. The system will work exactly like the real version, but with simulated payments. 