'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      setIsAuthorized(true);
    } else {
      router.replace('/login');
    }
  }, []);

  if (!isAuthorized) return null; // wait for validation

  return <>{children}</>;
}
