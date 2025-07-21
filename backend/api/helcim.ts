import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { sendAdminPurchaseNotification } from '../lib/mailer';

// Helcim API Configuration
const HELCIM_API_URL = process.env.HELCIM_API_URL || 'https://api.helcim.com/api/v1';
const HELCIM_ACCOUNT_ID = process.env.HELCIM_ACCOUNT_ID;
const HELCIM_API_TOKEN = process.env.HELCIM_API_TOKEN;

interface HelcimPaymentRequest {
  amount: number;
  currency: string;
  customerCode?: string;
  customerEmail?: string;
  customerName?: string;
  orderNumber?: string;
  comments?: string;
  saveCard?: boolean;
  cardToken?: string;
}

interface HelcimPaymentResponse {
  response: number;
  responseMessage: string;
  transactionId?: string;
  approvalCode?: string;
  cardToken?: string;
  customerCode?: string;
  cards?: any[];
  [key: string]: any; // Allow additional properties
}

// Helper function to make authenticated requests to Helcim
async function makeHelcimRequest(endpoint: string, data: any): Promise<HelcimPaymentResponse> {
  if (!HELCIM_ACCOUNT_ID || !HELCIM_API_TOKEN) {
    throw new Error('Helcim credentials not configured');
  }

  const response = await fetch(`${HELCIM_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HELCIM_API_TOKEN}`,
    },
    body: JSON.stringify({
      accountId: HELCIM_ACCOUNT_ID,
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error(`Helcim API error: ${response.statusText}`);
  }

  return response.json();
}

// Process a payment
export async function processPayment(req: Request, res: Response) {
  try {
    const {
      amount,
      currency = 'CAD',
      customerEmail,
      customerName,
      orderNumber,
      comments,
      saveCard = false,
      cardToken,
      cardData, // For new card transactions
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Prepare payment data
    const paymentData: HelcimPaymentRequest = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customerEmail,
      customerName,
      orderNumber,
      comments,
      saveCard,
    };

    // If using saved card
    if (cardToken) {
      paymentData.cardToken = cardToken;
    } else if (cardData) {
      // For new card, include card data
      Object.assign(paymentData, cardData);
    } else {
      return res.status(400).json({ error: 'Card information required' });
    }

    // Process payment with Helcim
    const result = await makeHelcimRequest('/transactions/preauth', paymentData);

    if (result.response === 0) {
      // Payment successful
      const payment = await prisma.payment.create({
        data: {
          amount: Math.round(amount * 100),
          currency,
          status: 'completed',
          type: 'merchandise', // or determine based on context
          customerEmail,
          customerName,
          metadata: {
            helcimResponse: result as any,
            cardToken: result.cardToken,
            customerCode: result.customerCode,
            transactionId: result.transactionId || '',
            approvalCode: result.approvalCode || '',
            orderNumber,
            comments,
          },
        },
      });

      // Send admin notification for successful purchase
      try {
        await sendAdminPurchaseNotification(payment);
      } catch (emailError) {
        console.error('Failed to send admin purchase notification:', emailError);
        // Don't fail the payment if email fails
      }

      res.json({
        success: true,
        payment,
        cardToken: result.cardToken,
        customerCode: result.customerCode,
      });
    } else {
      // Payment failed
      res.status(400).json({
        success: false,
        error: result.responseMessage,
        helcimResponse: result,
      });
    }
  } catch (error) {
    console.error('Helcim payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
    });
  }
}

// Save a card for future use
export async function saveCard(req: Request, res: Response) {
  try {
    const {
      customerEmail,
      customerName,
      cardData,
    } = req.body;

    if (!customerEmail || !cardData) {
      return res.status(400).json({ error: 'Customer email and card data required' });
    }

    // Use Helcim's card tokenization
    const result = await makeHelcimRequest('/cards/tokenize', {
      customerEmail,
      customerName,
      ...cardData,
    });

    if (result.response === 0 && result.cardToken) {
      res.json({
        success: true,
        cardToken: result.cardToken,
        customerCode: result.customerCode,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.responseMessage,
      });
    }
  } catch (error) {
    console.error('Helcim save card error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save card',
    });
  }
}

// Get saved cards for a customer
export async function getSavedCards(req: Request, res: Response) {
  try {
    const { customerCode } = req.params;

    if (!customerCode) {
      return res.status(400).json({ error: 'Customer code required' });
    }

    const result = await makeHelcimRequest('/cards/list', {
      customerCode,
    });

    if (result.response === 0) {
      res.json({
        success: true,
        cards: result.cards || [],
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.responseMessage,
      });
    }
  } catch (error) {
    console.error('Helcim get cards error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve saved cards',
    });
  }
}

// Delete a saved card
export async function deleteSavedCard(req: Request, res: Response) {
  try {
    const { cardToken } = req.params;

    if (!cardToken) {
      return res.status(400).json({ error: 'Card token required' });
    }

    const result = await makeHelcimRequest('/cards/delete', {
      cardToken,
    });

    if (result.response === 0) {
      res.json({
        success: true,
        message: 'Card deleted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.responseMessage,
      });
    }
  } catch (error) {
    console.error('Helcim delete card error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete card',
    });
  }
}

// Get payment history
export async function getPaymentHistory(req: Request, res: Response) {
  try {
    const { customerEmail, limit = 50, offset = 0 } = req.query;

    const payments = await prisma.payment.findMany({
      where: customerEmail ? { customerEmail: String(customerEmail) } : {},
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve payment history',
    });
  }
} 