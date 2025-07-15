// src/components/AdminAuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  // add other claims here if you need them (e.g. role)
}

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminJwt');
    if (!token) {
      return router.replace('/login');
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      // exp is in seconds since epoch
      if (Date.now() < exp * 1000) {
        setOk(true);
      } else {
        // token expired
        localStorage.removeItem('adminJwt');
        router.replace('/login');
      }
    } catch {
      // invalid token format
      localStorage.removeItem('adminJwt');
      router.replace('/login');
    }
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
