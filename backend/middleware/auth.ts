// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAdminAuth(req, res, next) {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  let token: string|undefined;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7);
  } else if (req.cookies?.adminJwt) {
    token = req.cookies.adminJwt;
  }
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

