// src/app/protected/payments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Payment, Registration } from '@/types';
import { fetchAdminData } from '@/lib/api';

type PaymentWithRegistration = Payment & {
  registration: Registration;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminData<PaymentWithRegistration[]>('api/payments');
        setPayments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payments');
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

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
              {p.type} • {p.registration.programName} • {new Date(p.createdAt).toLocaleDateString()}
            </div>
            {p.registration.email !== 'N/A' && (
              <div className="text-xs text-gray-500 mt-1">
                {p.registration.email}
              </div>
            )}
          </li>
        ))}
        {payments.length === 0 && (
          <li className="text-gray-500">No payments recorded yet.</li>
        )}
      </ul>
    </div>
  );
}
