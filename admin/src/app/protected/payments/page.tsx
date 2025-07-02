// src/app/protected/payments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Payment, Registration } from '@/types';

type PaymentWithRegistration = Payment & {
  registration: Registration;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithRegistration[]>([]);
  const API = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const token = localStorage.getItem('adminJwt');
    if (!token) {
      console.error('Not logged in');
      return;
    }

    fetch(`${API}/api/payments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setPayments)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <ul className="space-y-3">
        {payments.map((p) => (
          <li key={p.id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">
              {p.registration.playerName} – ${p.amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              {p.method} on {new Date(p.createdAt).toLocaleDateString()}
            </div>
          </li>
        ))}
        {payments.length === 0 && (
          <li className="text-gray-500">No payments recorded yet.</li>
        )}
      </ul>
    </div>
  );
}
