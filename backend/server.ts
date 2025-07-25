import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { createClient } from '@supabase/supabase-js';
import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getPrismaClient } from './lib/prisma.js';
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
import * as contactHandlers from './api/contact';
import { readdirSync } from 'fs';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Load environment variables
dotenv.config();


// Handle database URL for different environments
let databaseUrl = process.env.DATABASE_URL;

// Log the database URL being used (without credentials)
console.log('✅ Database URL being used:', databaseUrl?.replace(/:[^:@]*@/, ':****@'));

// Validate that we have a database URL
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  process.exit(1);
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
  file?: Express.Multer.File;
}


const envPath = path.resolve(process.cwd(), '.env');
const app = express();



app.get('/api/_test-db', async (req, res) => {
  console.log('🔗 Testing database connection...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
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

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test Prisma connection
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(503).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});


// Test database connection on startup
const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    await client.$disconnect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Temporarily disable database connection test to allow server to start
console.log('⚠️ Database connection test temporarily disabled to allow server startup');

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
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
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
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Test database connection with a new client instance
    const client = await getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    await client.$disconnect();
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/test-db', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📊 Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    
    const client = await getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    await client.$disconnect();
    res.json({ 
      status: 'success', 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/test-email', async (req: Request, res: Response) => {
  try {
    console.log('📧 Testing email functionality...');
    
    const { sendMail } = await import('./lib/mailer');
    
    await sendMail(
      process.env.ADMIN_EMAIL || 'test@example.com',
      'Test Email - United S.T.O.R.M. Basketball',
      `
      <h2>Test Email</h2>
      <p>This is a test email to verify the email system is working correctly.</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p>Best regards,<br>United S.T.O.R.M. Basketball System</p>
      `
    );
    
    res.json({ 
      status: 'success', 
      message: 'Test email sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Email test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/news', newsHandlers.GET);
app.get('/api/media', mediaHandlers.GET);
app.use('/api/merchandise', merchandiseRouter);

// Contact form routes
app.post('/api/contact', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(contactHandlers.POST(req, res)).catch(next);
});

app.get(
  '/api/teams',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(teams.GET(req, res)).catch((error) => {
      console.error('❌ Teams API error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        error: 'Failed to fetch teams',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Database connection issue'
      });
    });
  }
);

app.get(
  '/api/programs',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(programs.GET(req, res)).catch((error) => {
      console.error('❌ Programs API error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        error: 'Failed to fetch programs',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Database connection issue'
      });
    });
  }
);

app.get(
  '/api/registrations',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(registrations.GET(req, res)).catch((error) => {
      console.error('❌ Registrations API error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        error: 'Failed to fetch registrations',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Database connection issue'
      });
    });
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
    Promise.resolve(helcim.getPaymentHistory(req, res)).catch((error) => {
      console.error('❌ Payments API error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        error: 'Failed to fetch payments',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Payment service issue'
      });
    });
  }
);

app.get(
  '/api/events',
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(events.GET(req, res)).catch((error) => {
      console.error('❌ Events API error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({ 
        error: 'Failed to fetch events',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Database connection issue'
      });
    });
  }
);



app.post('/api/admin/news', requireAdminAuth, (req, res, next) => {
  // Use newsHandlers.POST consistently
  Promise.resolve(newsHandlers.POST(req, res)).catch(next);
});

// Admin contact message routes
app.get('/api/admin/contact', requireAdminAuth, (req, res, next) => {
  Promise.resolve(contactHandlers.GET(req, res)).catch(next);
});

app.put('/api/admin/contact/:id', requireAdminAuth, (req, res, next) => {
  Promise.resolve(contactHandlers.PUT(req, res)).catch(next);
});

app.delete('/api/admin/contact/:id', requireAdminAuth, (req, res, next) => {
  Promise.resolve(contactHandlers.DELETE(req, res)).catch(next);
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

// Waiver upload route (for user registrations)
app.post('/api/uploadWaiver', upload.single('file'), async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Received waiver upload request.');
    if (!req.file) {
      console.log('No file found in waiver upload request.');
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'File upload service not available. Supabase not configured.' });
    }

    const registrationId = req.body.registrationId;
    if (!registrationId) {
      return res.status(400).json({ error: 'Missing registrationId.' });
    }

    console.log('Waiver file details:', req.file.originalname, req.file.mimetype, req.file.size);
    console.log('Registration ID:', registrationId);

    const fileExt = req.file.originalname.split('.').pop();
    const filePath = `waivers/${registrationId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    console.log('Uploading waiver to filePath:', filePath);

    const { data, error: uploadError } = await supabase.storage
      .from('waivers')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase waiver upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload waiver to storage.', details: uploadError.message });
    }
    console.log('Supabase waiver upload successful:', data);

    const { data: publicUrlData } = supabase.storage.from('waivers').getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error('Supabase getPublicUrl error: No public URL returned', publicUrlData);
      return res.status(500).json({ error: 'Failed to get public URL for uploaded waiver.' });
    }
    console.log('Waiver Public URL:', publicUrlData.publicUrl);

    // Update registration with waiver URL
    const client = await getPrismaClient();
    await client.registration.update({
      where: { id: registrationId },
      data: { waiverUrl: publicUrlData.publicUrl },
    });

    res.json({ 
      message: 'Waiver uploaded and linked successfully!', 
      url: publicUrlData.publicUrl 
    });

  } catch (error) {
    console.error('Unhandled error during waiver upload:', error);
    res.status(500).json({ 
      error: 'Internal Server Error during waiver upload.', 
      details: (error as Error).message 
    });
  }
});

// Admin waiver form management routes
app.post('/api/admin/waiver-upload', requireAdminAuth, upload.single('file'), async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Received admin waiver form upload request.');
    if (!req.file) {
      console.log('No file found in admin waiver upload request.');
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'File upload service not available. Supabase not configured.' });
    }

    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: 'Missing waiver form name.' });
    }

    console.log('Admin waiver form details:', req.file.originalname, req.file.mimetype, req.file.size);
    console.log('Form name:', name);

    const fileExt = req.file.originalname.split('.').pop();
    const filePath = `waiver-forms/${name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.${fileExt}`;
    console.log('Uploading admin waiver form to filePath:', filePath);

    const { data, error: uploadError } = await supabase.storage
      .from('waivers')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase admin waiver upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload waiver form to storage.', details: uploadError.message });
    }
    console.log('Supabase admin waiver upload successful:', data);

    const { data: publicUrlData } = supabase.storage.from('waivers').getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error('Supabase getPublicUrl error: No public URL returned', publicUrlData);
      return res.status(500).json({ error: 'Failed to get public URL for uploaded waiver form.' });
    }
    console.log('Admin Waiver Form Public URL:', publicUrlData.publicUrl);

    // Store waiver form metadata in database (you might want to create a WaiverForm model)
    const client = await getPrismaClient();
    // For now, we'll just return the URL. You can add a WaiverForm table later if needed
    const waiverFormId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    res.json({ 
      id: waiverFormId,
      name: name,
      url: publicUrlData.publicUrl,
      uploadedAt: new Date().toISOString(),
      isActive: true
    });

  } catch (error) {
    console.error('Unhandled error during admin waiver upload:', error);
    res.status(500).json({ 
      error: 'Internal Server Error during admin waiver upload.', 
      details: (error as Error).message 
    });
  }
});

// Public endpoint for fetching waiver forms (no authentication required)
app.get('/api/waiver-forms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'File storage service not available.' });
    }

    // List files in the waivers bucket
    const { data, error } = await supabase.storage
      .from('waivers')
      .list('waiver-forms', {
        limit: 100,
        offset: 0,
      });

    if (error) {
      console.error('Error listing waiver forms:', error);
      return res.status(500).json({ error: 'Failed to list waiver forms.' });
    }

    // Transform the data to match the expected format
    // Filter out .emptyFolderPlaceholder and only return active forms
    const waiverForms = data?.filter((file: any) => 
      file.name !== '.emptyFolderPlaceholder' && 
      file.name && 
      file.name.trim() !== ''
    ).map((file: any, index: number) => ({
      id: file.name, // Use filename as ID for consistency
      name: file.name.replace(/-\d+\.\w+$/, '').replace(/-/g, ' '),
      url: `${process.env.SUPABASE_URL}/storage/v1/object/public/waivers/waiver-forms/${file.name}`,
      uploadedAt: file.created_at || new Date().toISOString(),
      isActive: true
    })) || [];

    res.json(waiverForms);

  } catch (error) {
    console.error('Error in waiver forms list:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

app.get('/api/admin/waiver-forms', requireAdminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'File storage service not available.' });
    }

    // List files in the waivers bucket
    const { data, error } = await supabase.storage
      .from('waivers')
      .list('waiver-forms', {
        limit: 100,
        offset: 0,
      });

    if (error) {
      console.error('Error listing waiver forms:', error);
      return res.status(500).json({ error: 'Failed to list waiver forms.' });
    }

    // Transform the data to match the expected format
    const waiverForms = data?.map((file: any, index: number) => ({
      id: file.name, // Use filename as ID for consistency
      name: file.name.replace(/-\d+\.\w+$/, '').replace(/-/g, ' '),
      url: `${process.env.SUPABASE_URL}/storage/v1/object/public/waivers/waiver-forms/${file.name}`,
      uploadedAt: file.created_at || new Date().toISOString(),
      isActive: true
    })) || [];

    res.json(waiverForms);

  } catch (error) {
    console.error('Error in waiver forms list:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

app.delete('/api/admin/waiver-forms/:id', requireAdminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete waiver form with ID:', id);
    
    if (!supabase) {
      return res.status(503).json({ error: 'File storage service not available.' });
    }

    // The ID is now the filename directly
    const filename = decodeURIComponent(id);
    const filePath = `waiver-forms/${filename}`;
    
    console.log('Deleting file:', filePath);

    // Delete the file from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from('waivers')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting file from storage:', deleteError);
      return res.status(500).json({ error: 'Failed to delete file from storage.' });
    }

    console.log('Successfully deleted file:', filePath);
    res.json({ message: 'Waiver form deleted successfully.' });

  } catch (error) {
    console.error('Error deleting waiver form:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

app.put('/api/admin/waiver-forms/:id/toggle', requireAdminAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    console.log('Toggling waiver form status:', id, 'to:', isActive);
    
    // For now, we'll just return success since we don't have a database table for waiver forms yet
    // In a real implementation, you'd update the waiver form status in the database
    // For now, the status is managed in the frontend state
    // The filename is available as the id parameter

    res.json({ 
      message: `Waiver form ${isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: isActive
    });

  } catch (error) {
    console.error('Error toggling waiver form status:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

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
  try {
    await events.POST(req, res);
  } catch (error) {
    console.error('❌ Events POST error in server handler:', error);
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code
    });
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error during event creation',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Database or validation error'
      });
    }
  }
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
    const client = await getPrismaClient();
    const team = await client.team.update({ where: { id }, data: { gender, ageGroup } });
    await client.$disconnect();
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
// Force redeploy to fix Prisma client cache
