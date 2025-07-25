"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "../../../constants";

interface Registration {
  id: string;
  playerName: string;
  parentName: string;
  email: string;
  phone: string;
  paymentStatus: string;
  createdAt: string;
  program: {
    name: string;
    price: number;
  };
  team: {
    ageGroup: string;
    gender: string;
  };
  payment?: {
    amount: number;
    createdAt: string;
  };
}

export default function RegistrationSuccessPage() {
  const { id } = useParams();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`${API_URL}/api/registrations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRegistration(data);
        }
      } catch (err) {
        console.error('Error fetching registration:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegistration();
    }
  }, [id]);

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

  if (!registration) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Registration Not Found</h1>
          <p>Unable to load registration details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-extrabold uppercase mb-4">
            Registration Successful!
          </h1>
          <p className="text-xl text-gray-300">
            Thank you for registering with United S.T.O.R.M. Basketball
          </p>
        </div>

        {/* Registration Details */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Registration Details</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Player Information</h3>
              <div className="space-y-2">
                <p><strong>Player Name:</strong> {registration.playerName}</p>
                <p><strong>Parent Name:</strong> {registration.parentName}</p>
                <p><strong>Email:</strong> {registration.email}</p>
                <p><strong>Phone:</strong> {registration.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Program Information</h3>
              <div className="space-y-2">
                <p><strong>Program:</strong> {registration.program.name}</p>
                <p><strong>Age Group:</strong> {registration.team.ageGroup}</p>
                <p><strong>Gender:</strong> {registration.team.gender}</p>
                <p><strong>Registration Date:</strong> {new Date(registration.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {registration.payment && (
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p><strong>Amount Paid:</strong> ${(registration.payment.amount / 100).toFixed(2)}</p>
                <p><strong>Payment Date:</strong> {new Date(registration.payment.createdAt).toLocaleDateString()}</p>
                <p><strong>Payment Status:</strong> 
                  <span className="ml-2 px-2 py-1 bg-green-600 text-white text-sm rounded">
                    {registration.paymentStatus.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="text-2xl mr-3">📧</div>
              <div>
                <h3 className="font-semibold">Confirmation Email</h3>
                <p className="text-gray-300">You will receive a confirmation email shortly with additional details.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">📅</div>
              <div>
                <h3 className="font-semibold">Program Schedule</h3>
                <p className="text-gray-300">Check our website for program schedules and important dates.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-3">📞</div>
              <div>
                <h3 className="font-semibold">Contact Us</h3>
                <p className="text-gray-300">If you have any questions, please contact us at stormbasketball@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Return to Home
          </a>
          <a
            href="/registration"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Register Another Player
          </a>
        </div>
      </div>
    </div>
  );
} 