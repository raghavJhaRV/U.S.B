// backend/api/payments.ts
import { PrismaClient } from '@prisma/client';
import { sendMail } from '../mailer';

const prisma = new PrismaClient();

export async function GET(_req: Request) {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        registration: {
          include: {
            team: true,
            program: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(payments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch payments' }), {
      status: 500,
    });
  }
}

export async function POST(req: any, res: any) {
  try {
    const { registrationId, amount, method } = req.body;

    if (!registrationId || !amount || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }



    const payment = await prisma.payment.create({
      data: {
        registrationId,
        amount,
        method,
      },
    });

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (registration) {
      await sendMail(
        registration.email,
        'Payment Confirmation - United S.T.O.R.M.',
        `<p>Hi ${registration.playerName},</p>
         <p>We have received your payment of $${amount.toFixed(2)} via ${method}.</p>
         <p>Thank you for your support!<br>United S.T.O.R.M. Basketball</p>`
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
