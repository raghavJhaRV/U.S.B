// /api/admin/login.ts
import { Request, Response } from 'express';

export const POST = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ token: process.env.ADMIN_TOKEN });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
};
