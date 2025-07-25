import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET - Get all payments for admin panel
export async function getPayments(req: Request, res: Response) {
  try {
    // Get registration payments
    const registrationPayments = await prisma.payment.findMany({
      where: {
        registrationId: {
          not: null
        }
      },
      include: {
        registration: {
          include: {
            program: true,
            team: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get merchandise order payments
    const orderPayments = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform registration payments to match expected format
    const transformedRegistrationPayments = registrationPayments.map(payment => ({
      id: payment.id,
      amount: payment.amount / 100, // Convert from cents to dollars
      type: payment.type,
      createdAt: payment.createdAt.toISOString(),
      registration: {
        id: payment.registration?.id || '',
        playerName: payment.registration?.playerName || '',
        parentName: payment.registration?.parentName || '',
        email: payment.registration?.email || '',
        phone: payment.registration?.phone || '',
        programName: payment.registration?.program?.name || '',
        teamLabel: payment.registration?.team ? `${payment.registration.team.gender} ${payment.registration.team.ageGroup}` : '',
        teamId: payment.registration?.teamId || '',
        programId: payment.registration?.programId || ''
      }
    }));

    // Transform order payments to match expected format
    const transformedOrderPayments = orderPayments.map(order => ({
      id: order.id,
      amount: parseFloat(order.amount.toString()),
      type: 'merchandise',
      createdAt: order.createdAt.toISOString(),
      registration: {
        id: order.id,
        playerName: `Merchandise Order - ${order.itemId}`,
        parentName: 'N/A',
        email: 'N/A',
        phone: 'N/A',
        programName: 'Merchandise Purchase',
        teamLabel: 'N/A',
        teamId: 'N/A',
        programId: 'N/A'
      }
    }));

    // Combine and sort all payments by date
    const allPayments = [...transformedRegistrationPayments, ...transformedOrderPayments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(allPayments);

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
}

// GET - Get payment by ID
export async function getPaymentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // First try to find as registration payment
    let payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        registration: {
          include: {
            program: true,
            team: true
          }
        }
      }
    });

    if (payment) {
      // Transform registration payment
      const transformedPayment = {
        id: payment.id,
        amount: payment.amount / 100,
        type: payment.type,
        createdAt: payment.createdAt.toISOString(),
        registration: {
          id: payment.registration?.id || '',
          playerName: payment.registration?.playerName || '',
          parentName: payment.registration?.parentName || '',
          email: payment.registration?.email || '',
          phone: payment.registration?.phone || '',
          programName: payment.registration?.program?.name || '',
          teamLabel: payment.registration?.team ? `${payment.registration.team.gender} ${payment.registration.team.ageGroup}` : '',
          teamId: payment.registration?.teamId || '',
          programId: payment.registration?.programId || ''
        }
      };
      return res.json(transformedPayment);
    }

    // If not found as registration payment, try as order
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (order) {
      const transformedOrder = {
        id: order.id,
        amount: parseFloat(order.amount.toString()),
        type: 'merchandise',
        createdAt: order.createdAt.toISOString(),
        registration: {
          id: order.id,
          playerName: `Merchandise Order - ${order.itemId}`,
          parentName: 'N/A',
          email: 'N/A',
          phone: 'N/A',
          programName: 'Merchandise Purchase',
          teamLabel: 'N/A',
          teamId: 'N/A',
          programId: 'N/A'
        }
      };
      return res.json(transformedOrder);
    }

    res.status(404).json({ error: 'Payment not found' });

  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
} 