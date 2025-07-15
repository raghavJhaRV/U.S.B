// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = { exp: number /* plus any custom claims */ };

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminJwt');
    if (!token) {
      // no token → force login
      router.replace('/login');
      return;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (Date.now() / 1000 > exp) {
        // token expired → clear and re-login
        localStorage.removeItem('adminJwt');
        router.replace('/login');
      } else {
        // still valid → go to dashboard
        router.replace('/protected/dashboard');
      }
    } catch {
      // bad token → clear and re-login
      localStorage.removeItem('adminJwt');
      router.replace('/login');
    }
  }, [router]);

  // you can show a little spinner here while you redirect
  return <p>Checking auth…</p>;
}
