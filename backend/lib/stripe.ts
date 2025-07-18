import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

// Product types for different payment categories
export const PRODUCT_TYPES = {
  MERCHANDISE: 'merchandise',
  REGISTRATION: 'registration',
} as const;

// Create Stripe products for different registration types
export const REGISTRATION_PRODUCTS = {
  BOYS_REGISTRATION: {
    name: 'Boys Basketball Registration',
    description: 'Registration fee for boys basketball program',
    price: 15000, // $150.00 in cents
  },
  GIRLS_REGISTRATION: {
    name: 'Girls Basketball Registration',
    description: 'Registration fee for girls basketball program',
    price: 15000, // $150.00 in cents
  },
} as const; 