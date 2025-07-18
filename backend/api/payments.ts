// backend/api/payments.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { stripe, PRODUCT_TYPES, REGISTRATION_PRODUCTS } from '../lib/stripe';

const prisma = new PrismaClient();

// Get all payments (admin only)
export const GET = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        registration: true,
      },
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Create payment intent for merchandise
export const createMerchandisePaymentIntent = async (req: Request, res: Response) => {
  try {
    const { items, customerEmail, customerName } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        type: PRODUCT_TYPES.MERCHANDISE,
        customerEmail,
        customerName,
        items: JSON.stringify(items),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating merchandise payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

// Create payment intent for registration
export const createRegistrationPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { registrationType, customerEmail, customerName, playerName, ageGroup, gender } = req.body;

    if (!registrationType || !customerEmail || !customerName || !playerName || !ageGroup || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = REGISTRATION_PRODUCTS[registrationType as keyof typeof REGISTRATION_PRODUCTS];
    if (!product) {
      return res.status(400).json({ error: 'Invalid registration type' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price,
      currency: 'usd',
      metadata: {
        type: PRODUCT_TYPES.REGISTRATION,
        registrationType,
        customerEmail,
        customerName,
        playerName,
        ageGroup,
        gender,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: product.price,
    });
  } catch (error) {
    console.error('Error creating registration payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

// Confirm payment and save to database
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, registrationData } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Save payment to database
    const payment = await prisma.payment.create({
      data: {
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        stripePaymentIntentId: paymentIntent.id,
        type: paymentIntent.metadata.type,
        customerEmail: paymentIntent.metadata.customerEmail,
        customerName: paymentIntent.metadata.customerName,
        metadata: paymentIntent.metadata,
      },
    });

    // If this is a registration payment, create registration record
    if (paymentIntent.metadata.type === PRODUCT_TYPES.REGISTRATION && registrationData) {
      const registration = await prisma.registration.create({
        data: {
          ...registrationData,
          paymentId: payment.id,
          status: 'confirmed',
        },
      });

      return res.json({
        success: true,
        payment,
        registration,
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

// Webhook to handle Stripe events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // You can add additional logic here
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        registration: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

