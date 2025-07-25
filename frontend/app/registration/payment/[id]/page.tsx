"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "../../../constants";
import HelcimPaymentFormTest from "../../../components/HelcimPaymentFormTest";

interface Registration {
  id: string;
  playerName: string;
  parentName: string;
  email: string;
  phone: string;
  paymentStatus: string;
  program: {
    name: string;
    price: number;
  };
  team: {
    ageGroup: string;
    gender: string;
  };
}

export default function RegistrationPaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`${API_URL}/api/registrations/${id}`);
        if (!response.ok) {
          throw new Error('Registration not found');
        }
        const data = await response.json();
        setRegistration(data);
      } catch (err) {
        setError('Failed to load registration details');
        console.error('Error fetching registration:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegistration();
    }
  }, [id]);

  const handlePaymentSuccess = async (payment: any) => {
    try {
      // Update registration status to paid
      const response = await fetch(`${API_URL}/api/registrations/${id}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: payment.id,
        }),
      });

      if (response.ok) {
        // Redirect to success page
        router.push(`/registration/success/${id}`);
      } else {
        setError('Failed to confirm payment');
      }
    } catch (err) {
      setError('Failed to confirm payment');
      console.error('Error confirming payment:', err);
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading registration details...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-400 mb-4">{error || 'Registration not found'}</p>
          <button
            onClick={() => router.push('/registration')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  if (registration.paymentStatus === 'paid') {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Already Completed</h1>
          <p className="mb-4">This registration has already been paid for.</p>
          <button
            onClick={() => router.push(`/registration/success/${id}`)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            View Registration Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-8">
          Complete Registration Payment
        </h1>

        {/* Registration Summary */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Registration Summary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>Player Name:</strong> {registration.playerName}</p>
              <p><strong>Parent Name:</strong> {registration.parentName}</p>
              <p><strong>Email:</strong> {registration.email}</p>
              <p><strong>Phone:</strong> {registration.phone}</p>
            </div>
            <div>
              <p><strong>Program:</strong> {registration.program.name}</p>
              <p><strong>Age Group:</strong> {registration.team.ageGroup}</p>
              <p><strong>Gender:</strong> {registration.team.gender}</p>
              <p><strong>Amount:</strong> ${registration.program.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          <HelcimPaymentFormTest
            amount={registration.program.price}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            customerEmail={registration.email}
            customerName={registration.parentName}
            orderNumber={`REG-${registration.id}`}
            comments={`Registration for ${registration.playerName} - ${registration.program.name}`}
            allowSaveCard={true}
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 