import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

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
import * as helcim from './api/helcim';
import { readdirSync } from 'fs';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Load environment variables
dotenv.config();


// Handle database URL for different environments
let databaseUrl = process.env.DATABASE_URL;

// If we're in production and the URL contains pooler, try multiple connection strategies
if (process.env.NODE_ENV === 'production' && databaseUrl?.includes('pooler')) {
  console.log('🔄 Production pooler URL detected, trying multiple connection strategies');
  console.log('🔗 Original URL:', databaseUrl);
  
  // Strategy 1: Try to convert pooler URL to direct connection
  const directUrl = databaseUrl
    .replace('aws-0-us-west-1.pooler.supabase.com:6543', 'db.bratlcnxybxyydxnnimr.supabase.co:5432')
    .replace('pooler.', '');
  
  console.log('🔗 Strategy 1 - Direct URL:', directUrl);
  
  // Strategy 2: Try with different port (5433 is sometimes used for direct connections)
  const directUrlAlt = databaseUrl
    .replace('aws-0-us-west-1.pooler.supabase.com:6543', 'db.bratlcnxybxyydxnnimr.supabase.co:5433')
    .replace('pooler.', '');
  
  console.log('🔗 Strategy 2 - Alternative Direct URL:', directUrlAlt);
  
  // Strategy 3: Try the original pooler URL (sometimes it works with proper credentials)
  console.log('🔗 Strategy 3 - Original Pooler URL:', databaseUrl);
  
  // For now, try the original pooler URL first (since the direct connection is failing)
  // databaseUrl = directUrl; // Commented out to try pooler first
  console.log('🔄 Using original pooler URL as primary strategy');
}

// Alternative: If you have a separate direct database URL environment variable
if (process.env.DIRECT_DATABASE_URL) {
  console.log('🔗 Using DIRECT_DATABASE_URL from environment');
  databaseUrl = process.env.DIRECT_DATABASE_URL;
}

// Fallback: If still using pooler URL and we're in production, try the original pooler URL
if (process.env.NODE_ENV === 'production' && databaseUrl?.includes('pooler')) {
  console.log('⚠️  Still using pooler URL, this might fail but trying anyway');
}

// Store the original pooler URL for potential fallback
const originalPoolerUrl = process.env.DATABASE_URL?.includes('pooler') ? process.env.DATABASE_URL : null;

console.log('✅ Final database URL being used:', databaseUrl?.replace(/:[^:@]*@/, ':****@'));

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


// Create Prisma client with retry logic
let prisma: PrismaClient;

const createPrismaClient = (url: string) => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: url,
      },
    },
  });
};

prisma = createPrismaClient(databaseUrl || '');

// Test database connection on startup with retry logic
const testDatabaseConnection = async (url: string, attempt: number = 1): Promise<boolean> => {
  try {
    const testClient = createPrismaClient(url);
    await testClient.$connect();
    await testClient.$disconnect();
    return true;
  } catch (error: any) {
    console.error(`❌ Database connection attempt ${attempt} failed:`, error.message);
    return false;
  }
};

const initializeDatabase = async () => {
  // Try the primary database URL first
  let success = await testDatabaseConnection(databaseUrl || '', 1);
  
  if (!success && process.env.NODE_ENV === 'production') {
    // Try the direct URL as fallback
    const directUrl = process.env.DATABASE_URL?.replace('aws-0-us-west-1.pooler.supabase.com:6543', 'db.bratlcnxybxyydxnnimr.supabase.co:5432');
    if (directUrl && directUrl !== databaseUrl) {
      console.log('🔄 Trying direct URL as fallback...');
      success = await testDatabaseConnection(directUrl, 2);
      
      if (success) {
        console.log('✅ Connected using direct URL');
        // Recreate Prisma client with working URL
        await prisma.$disconnect();
        prisma = createPrismaClient(directUrl);
      }
    }
    
    // If direct URL fails, try original pooler URL
    if (!success && originalPoolerUrl) {
      console.log('🔄 Trying original pooler URL as final fallback...');
      success = await testDatabaseConnection(originalPoolerUrl, 3);
      
      if (success) {
        console.log('✅ Connected using original pooler URL');
        // Recreate Prisma client with working URL
        await prisma.$disconnect();
        prisma = createPrismaClient(originalPoolerUrl);
      }
    }
  }
  
  if (success) {
    console.log('✅ Database connected successfully');
  } else {
    console.log('⚠️  All database connection attempts failed. Server will continue running but database operations may fail');
    
    // Additional debugging information
    console.log('🔍 Available URLs tried:');
    console.log('  - Primary:', databaseUrl?.replace(/:[^:@]*@/, ':****@'));
    if (originalPoolerUrl) {
      console.log('  - Fallback:', originalPoolerUrl?.replace(/:[^:@]*@/, ':****@'));
    }
  }
};

initializeDatabase();

// Global middleware
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://usb-admin.onrender.com', 
      'https://u-s-b-frontend.onrender.com',
      'https://usb-frontend.onrender.com',
      'https://usb-business-consulting.onrender.com'
    ] // Allow multiple possible frontend URLs in production
  : [
      'http://localhost:3002', 
      'http://localhost:3000', 
      'https://usb-admin.onrender.com', 
      'https://u-s-b-frontend.onrender.com',
      'https://usb-frontend.onrender.com',
      'https://usb-business-consulting.onrender.com'
    ]; // Allow local dev origins + production URLs

app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 CORS request from origin:', origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    console.log('✅ CORS allowed origin:', origin);
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
    Promise.resolve(helcim.getPaymentHistory(req, res)).catch(next)
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

// --- Helcim Payment routes ---
app.post(
  '/api/payments/process',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(helcim.processPayment(req, res)).catch(next);
  }
);

app.post(
  '/api/payments/save-card',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(helcim.saveCard(req, res)).catch(next);
  }
);

app.get(
  '/api/payments/saved-cards/:customerCode',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(helcim.getSavedCards(req, res)).catch(next);
  }
);

app.delete(
  '/api/payments/saved-cards/:cardToken',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(helcim.deleteSavedCard(req, res)).catch(next);
  }
);

app.get(
  '/api/payments/history',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(helcim.getPaymentHistory(req, res)).catch(next);
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
