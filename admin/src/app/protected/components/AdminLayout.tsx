// src/app/protected/components/AdminLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      setIsAuthorized(true);
    } else {
      router.replace('/login');
    }
  }, [pathname, router]);

  if (!isAuthorized) return null; 

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
