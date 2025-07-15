// src/app/protected/components/AdminLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { jwtDecode } from 'jwt-decode';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminJwt');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (Date.now() < exp * 1000) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.replace('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      setIsAuthorized(false);
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
