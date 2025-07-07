import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Client } from 'pg';

import * as exportRegistrations from './api/admin/exportRegistrations';
import * as payments from './api/payments';
import * as stats from './api/stats';
import * as teams from './api/teams';
import * as programs from './api/programs';
import * as register from './api/register';
import * as registrations from './api/registrations';
import * as events from './api/events';
import { requireAdminAuth } from './middleware/auth';
import path from 'path';
import { readdirSync } from 'fs';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Load environment variables
dotenv.config();
console.log('ℹ️  process.cwd():', process.cwd());
console.log('ℹ️  Contents of cwd:', readdirSync(process.cwd()));
console.log('🔑 process.env.ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
console.log('🔑 process.env.JWT_SECRET:', process.env.JWT_SECRET);
console.log('❓ DATABASE_URL:', process.env.DATABASE_URL);

const envPath = path.resolve(process.cwd(), '.env');
const app = express();

app.get('/api/_test-db', async (req, res) => {
  console.log('🔗 Connecting to database...', process.env.DATABASE_URL);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // Supabase often requires SSL:
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    const { rows } = await client.query('SELECT 1 AS ok')
    await client.end()
    res.json({ success: true, rows })
  } catch (err: any) {
    console.error('DB test error:', err)
    res
      .status(500)
      .json({ success: false, message: err.message })
  }
})


const prisma = new PrismaClient();

// Global middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'https://usb-admin.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Public routes ---
app.get(
  '/api/teams',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(teams.GET(req, res)).catch(next);
  }
);

app.get(
  '/api/programs',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(programs.GET(req, res)).catch(next);
  }
);

app.get(
  '/api/registrations',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(registrations.GET(req, res)).catch(next);
  }
);

app.get(
  '/api/stats',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(stats.GET(req, res)).catch(next);
  }
);

app.get(
  '/api/payments',
  requireAdminAuth,             // if you want this protected
  (req: Request, res: Response, next: NextFunction) => {
    payments.GET(req, res).catch(next)
  }
)

app.get(
  '/api/events',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { teamId } = req.query;
      const list = await prisma.event.findMany({
        where: teamId ? { teamId: String(teamId) } : undefined,
        orderBy: { date: 'asc' },
        include: { team: true },
      });
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/register',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(register.POST(req, res)).catch(next);
  }
);

app.post(
  '/api/teams',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(teams.POST(req, res)).catch(next);
  }
);

app.post(
  '/api/payments',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(payments.POST(req, res)).catch(next);
  }
);

app.post('/api/events', requireAdminAuth, async (req, res, next) => {
  Promise.resolve(events.POST(req, res)).catch(next);
});

// --- Public login ---
app.post(
  '/api/admin/login',
  (req: Request, res: Response) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      console.log('▶️  login pw:', password);
      console.log('🔑  ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '2h' }
      );
      res.cookie('adminJwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 2 * 60 * 60 * 1000,
      });
      res.json({ token });

      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
);

// --- Protected routes under /api/admin ---
app.use('/api/admin', requireAdminAuth);

app.get(
  '/api/admin/exportRegistrations',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proxyRes = await exportRegistrations.GET();
      const body = await proxyRes.text();
      res.status(proxyRes.status)
        .set(Object.fromEntries(proxyRes.headers))
        .send(body);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/programs',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(programs.POST(req, res)).catch(next);
  }
);

app.delete(
  '/api/teams/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(teams.DELETE(req, res)).catch(next);
  }
);

app.delete(
  '/api/programs/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(programs.DELETE(req, res)).catch(next);
  }
);

app.delete(
  '/api/registrations/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(registrations.DELETE(req, res)).catch(next);
  }
);


app.delete(
  '/api/events/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(events.DELETE(req, res)).catch(next);
  }
);




app.put('/api/teams/:id', requireAdminAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gender, ageGroup } = req.body;
    if (!id || !gender || !ageGroup) {
      res.status(400).json({ error: 'Missing id, gender or ageGroup' });
      return;
    }
    const team = await prisma.team.update({ where: { id }, data: { gender, ageGroup } });
    res.json(team);
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(409).json({ error: 'This team already exists.' });
      return;
    }
    console.error('Update Team Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put(
  '/api/registrations/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    registrations.PUT(req, res).catch(next);
  }
);
app.put(
  '/api/events/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    events.PUT(req, res).catch(next);
  }
);
app.put(
  '/api/programs/:id',
  requireAdminAuth,
  (req: Request, res: Response, next: NextFunction) => {
    programs.PUT(req, res).catch(next);
  }
);







app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error in handler:', err.stack || err);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

// Start server
app.listen(3001, () => {
  console.log('✅ Backend running on http://localhost:3001');
});
