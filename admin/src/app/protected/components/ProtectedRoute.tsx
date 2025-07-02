'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [ok, setOk] = useState(false);
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
                setOk(true);
            } else {
                // expired
                localStorage.removeItem('adminJwt');
                router.replace('/login');
            }
        } catch {
            // invalid token
            localStorage.removeItem('adminJwt');
            router.replace('/login');
        }
    }, [router]);

    if (!ok) return null;
    return <>{children}</>;
}
