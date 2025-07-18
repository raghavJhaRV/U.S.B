import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
console.log('dns.setDefaultResultOrder("ipv4first")', dns.getDefaultResultOrder());
import { createClient } from '@supabase/supabase-js';
import express, { Request, Response, NextFunction } from 'express';
import multer, { File as MulterFile } from 'multer';
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
import * as newsHandlers from './api/news'
import * as mediaHandlers from './api/media';
import merchandiseRouter from './api/merchandise';
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

// Handle database URL for different environments
let databaseUrl = process.env.DATABASE_URL;

// If we're in production and the URL contains pooler, try to use direct connection as fallback
if (process.env.NODE_ENV === 'production' && databaseUrl?.includes('pooler')) {
  // Try to convert pooler URL back to direct connection
  const directUrl = databaseUrl
    .replace('aws-0-us-west-1.pooler.supabase.com:6543', 'db.bratlcnxybxyydxnnimr.supabase.co:5432')
    .replace('pooler.', '');
  
  console.log('🔄 Production pooler URL detected, trying direct connection as fallback');
  console.log('🔗 Original URL:', databaseUrl);
  console.log('🔗 Direct URL:', directUrl);
  
  // For now, use the direct URL as the primary option
  databaseUrl = directUrl;
}

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️  Supabase environment variables not set. File uploads will be disabled.');
}


// Configure Multer for in-memory storage for file processing
const upload = multer({ storage: multer.memoryStorage() });


interface MulterRequest extends Request {
  file?: MulterFile;
}


const envPath = path.resolve(process.cwd(), '.env');
const app = express();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
  });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1 as test`;
    res.json({ status: 'connected', message: 'Database is working!' });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      status: 'failed', 
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
    });
  }
});

app.get('/api/_test-db', async (req, res) => {
  console.log('🔗 Connecting to database...', databaseUrl);
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    family: 4,    // ← force IPv4
  });

  try {
    await client.connect();
    const { rows } = await client.query('SELECT 1 AS ok');
    await client.end();
    res.json({ success: true, rows });
  } catch (err: any) {
    console.error('DB test error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});


const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// Test database connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Server will continue running but database operations may fail');
  });

// Global middleware
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://usb-admin.onrender.com', 'https://u-s-b-frontend.onrender.com'] // Allow both admin and frontend URLs in production
  : ['http://localhost:3002', 'http://localhost:3000', 'https://usb-admin.onrender.com', 'https://u-s-b-frontend.onrender.com']; // Allow local dev origins + production URLs
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// --- Public routes ---
app.get('/api/news', newsHandlers.GET);
app.get('/api/media', mediaHandlers.GET);
app.use('/api/merchandise', merchandiseRouter);

app.get(
  '/api/teams',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(teams.GET(req, res)).catch((error) => {
      console.error('Teams API error:', error);
      res.status(500).json({ error: 'Database connection failed. Please try again later.' });
    });
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



app.post('/api/admin/news', requireAdminAuth, (req, res, next) => {
  // Use newsHandlers.POST consistently
  Promise.resolve(newsHandlers.POST(req, res)).catch(next);
});

app.post('/api/admin/media-upload', requireAdminAuth, upload.single('file'), async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        console.log('Received file upload request.');
        if (!req.file) {
            console.log('No file found in request.');
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        if (!supabase) {
            return res.status(503).json({ error: 'File upload service not available. Supabase not configured.' });
        }

        console.log('File details:', req.file.originalname, req.file.mimetype, req.file.size);

        const file = req.file;
        const bucketName = 'usb-media'; // Your Supabase bucket name
        console.log('Using bucket:', bucketName);

        // Generate a unique file name
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const filePath = `${fileName}`;
        console.log('Uploading to filePath:', filePath);

        const { data, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ error: 'Failed to upload file to storage.', details: uploadError.message });
        }
        console.log('Supabase upload successful:', data);

        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
            console.error('Supabase getPublicUrl error: No public URL returned', publicUrlData);
            return res.status(500).json({ error: 'Failed to get public URL for uploaded file.' });
        }
        console.log('Public URL:', publicUrlData.publicUrl);

        res.json({ url: publicUrlData.publicUrl });

    } catch (error) {
        console.error('Unhandled error during media upload:', error);
        res.status(500).json({ error: 'Internal Server Error during file upload.', details: (error as Error).message });
    }
});

app.post('/api/admin/media', requireAdminAuth, (req, res, next) => { Promise.resolve(mediaHandlers.POST(req, res)).catch(next); });

app.post('/api/admin/merchandise', requireAdminAuth, merchandiseRouter);

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

app.delete('/api/admin/news/:id', requireAdminAuth, (req, res, next) => {
  Promise.resolve(newsHandlers.DELETE(req, res)).catch(next);
});

app.delete('/api/admin/media/:id', requireAdminAuth, (req, res, next) => { Promise.resolve(mediaHandlers.DELETE(req, res)).catch(next); });

app.delete('/api/admin/merchandise/:id', requireAdminAuth, merchandiseRouter);


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



app.put('/api/admin/news/:id', requireAdminAuth, (req, res, next) => {
  // Use newsHandlers.PUT consistently
  Promise.resolve(newsHandlers.PUT(req, res)).catch(next);
});

app.put('/api/admin/media/:id', requireAdminAuth, (req, res, next) => { Promise.resolve(mediaHandlers.PUT(req, res)).catch(next); });

app.put('/api/admin/merchandise/:id', requireAdminAuth, merchandiseRouter);

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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
