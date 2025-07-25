import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Test Helcim API - Simulates payment processing
export async function processTestPayment(req: Request, res: Response) {
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
      cardData,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate different payment scenarios
    const cardNumber = cardData?.cardNumber || 'test';
    let success = true;
    let errorMessage = '';

    // Simulate failed payments for certain test card numbers
    if (cardNumber.includes('4000000000000002')) {
      success = false;
      errorMessage = 'Card declined';
    } else if (cardNumber.includes('4000000000009995')) {
      success = false;
      errorMessage = 'Insufficient funds';
    } else if (cardNumber.includes('4000000000000069')) {
      success = false;
      errorMessage = 'Expired card';
    }

    if (!success) {
      return res.status(400).json({
        success: false,
        error: errorMessage,
        helcimResponse: {
          response: 1,
          responseMessage: errorMessage,
          transactionId: `test_${Date.now()}`,
        },
      });
    }

    // Simulate successful payment
    const testTransactionId = `test_txn_${Date.now()}`;
    const testCardToken = saveCard ? `test_token_${Date.now()}` : null;
    const testCustomerCode = `test_customer_${Date.now()}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        status: 'completed',
        type: 'registration',
        customerEmail,
        customerName,
        metadata: {
          helcimResponse: {
            response: 0,
            responseMessage: 'Approved',
            cardToken: testCardToken,
            customerCode: testCustomerCode,
            transactionId: testTransactionId,
            approvalCode: 'TEST123',
            orderNumber,
            comments,
          },
          isTestPayment: true,
        },
      },
    });

    // If this is a registration payment, link it to the registration
    if (orderNumber && orderNumber.startsWith('REG-')) {
      const registrationId = orderNumber.replace('REG-', '');
      try {
        await prisma.registration.update({
          where: { id: registrationId },
          data: {
            paymentStatus: 'paid',
            payment: {
              connect: { id: payment.id },
            },
          },
        });
      } catch (error) {
        console.warn('Could not link payment to registration:', error);
      }
    }

    console.log('✅ Test payment processed successfully:', {
      amount,
      customerEmail,
      transactionId: testTransactionId,
    });

    res.json({
      success: true,
      payment,
      cardToken: testCardToken,
      customerCode: testCustomerCode,
      helcimResponse: {
        response: 0,
        responseMessage: 'Approved',
        transactionId: testTransactionId,
        approvalCode: 'TEST123',
      },
    });
  } catch (error) {
    console.error('Test payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Test payment processing failed',
    });
  }
}

// Test saved cards endpoint
export async function getTestSavedCards(req: Request, res: Response) {
  try {
    const { customerEmail } = req.query;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email required' });
    }

    // Return mock saved cards
    const mockCards = [
      {
        cardToken: 'test_token_visa',
        cardType: 'visa',
        lastFour: '1111',
        expiryMonth: '12',
        expiryYear: '2025',
        cardholderName: 'Test User',
      },
      {
        cardToken: 'test_token_mastercard',
        cardType: 'mastercard',
        lastFour: '4444',
        expiryMonth: '10',
        expiryYear: '2026',
        cardholderName: 'Test User',
      },
    ];

    res.json(mockCards);
  } catch (error) {
    console.error('Error fetching test saved cards:', error);
    res.status(500).json({ error: 'Failed to fetch saved cards' });
  }
} 