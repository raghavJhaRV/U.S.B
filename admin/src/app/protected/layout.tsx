// src/app/protected/layout.tsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout    from '@/components/AdminLayout';

export default function ProtectedRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
