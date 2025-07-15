'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminJwt');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      if (Date.now() < exp * 1000) {
        setIsAuthorized(true); // token is valid
      } else {
        setIsAuthorized(false); // token expired
        router.push('/admin/login');
      }
    } catch (e) {
      console.error('Invalid token', e);
      router.push('/admin/login');
      return;
    }
  }, []);

  if (!isAuthorized) return null; // wait for validation

  return <>{children}</>;
}
