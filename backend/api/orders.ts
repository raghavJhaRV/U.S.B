import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// POST - Create new order
export async function createOrder(req: Request, res: Response) {
  try {
    const {
      productId,
      productName,
      size,
      quantity,
      total,
      paymentId,
      customerEmail,
      customerName,
    } = req.body;

    // Validate required fields
    if (!productId || !productName || !size || !quantity || !total || !paymentId) {
      return res.status(400).json({ 
        error: 'Missing required fields: productId, productName, size, quantity, total, paymentId' 
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        itemId: productId,
        itemType: 'merchandise',
        amount: total,
        currency: 'CAD',
        status: 'completed',
        stripeId: paymentId, // Using stripeId field for Helcim payment ID
      },
    });

    // Update merchandise stock
    try {
      await prisma.merchandise.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity
          }
        }
      });
    } catch (stockError) {
      console.error('Failed to update stock:', stockError);
      // Don't fail the order creation if stock update fails
    }

    // Send admin notification
    try {
      const { sendAdminPurchaseNotification } = await import('../lib/mailer');
      await sendAdminPurchaseNotification({
        id: order.id,
        amount: total * 100, // Convert to cents for email function
        customerEmail,
        customerName,
        orderNumber: order.id,
        transactionId: paymentId,
        type: 'merchandise',
        createdAt: new Date(),
        comments: `${productName} - Size: ${size} - Qty: ${quantity}`,
      });
    } catch (emailError) {
      console.warn('Failed to send admin notification:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        productName,
        size,
        quantity,
        total,
        status: order.status,
        createdAt: order.createdAt,
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET - Get all orders (for admin)
export async function getOrders(req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

// GET - Get order by ID
export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
} 