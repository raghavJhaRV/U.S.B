// src/components/ProtectedRoute.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';

import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('adminJwt')) {
      setOk(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
