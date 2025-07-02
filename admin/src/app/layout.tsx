// app/layout.tsx
import './globals.css';
import '../styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Panel | USB',
  description: 'Manage teams, programs, registrations, and events.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
