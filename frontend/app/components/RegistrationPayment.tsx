'use client';

import { useState } from 'react';
import { PaymentForm } from './PaymentForm';

interface RegistrationData {
  playerName: string;
  parentName: string;
  email: string;
  phone: string;
  ageGroup: string;
  gender: string;
  waiverAccepted: boolean;
}

interface RegistrationPaymentProps {
  registrationType: 'BOYS_REGISTRATION' | 'GIRLS_REGISTRATION';
  registrationData: RegistrationData;
  onSuccess: (paymentIntentId: string, registrationId: string) => void;
  onError: (error: string) => void;
}

const REGISTRATION_PRICES = {
  BOYS_REGISTRATION: 15000, // $150.00
  GIRLS_REGISTRATION: 15000, // $150.00
};

export const RegistrationPayment = ({ 
  registrationType, 
  registrationData, 
  onSuccess, 
  onError 
}: RegistrationPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const amount = REGISTRATION_PRICES[registrationType];

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setIsProcessing(true);
    
    try {
      // Create payment intent on the server
      const response = await fetch('/api/payments/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationType,
          customerEmail: registrationData.email,
          customerName: registrationData.parentName,
          playerName: registrationData.playerName,
          ageGroup: registrationData.ageGroup,
          gender: registrationData.gender,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();
      
      // Confirm the payment and create registration
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          registrationData: {
            ...registrationData,
            waiverAccepted: true,
            waiverUrl: '', // You can add waiver URL logic here
            eTransferNote: '',
          },
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm payment');
      }

      const { registration } = await confirmResponse.json();
      onSuccess(paymentIntentId, registration.id);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRegistrationTitle = () => {
    return registrationType === 'BOYS_REGISTRATION' 
      ? 'Boys Basketball Registration' 
      : 'Girls Basketball Registration';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Registration Payment</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Program:</span>
            <span>{getRegistrationTitle()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Player Name:</span>
            <span>{registrationData.playerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Parent Name:</span>
            <span>{registrationData.parentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Age Group:</span>
            <span>{registrationData.ageGroup}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Gender:</span>
            <span>{registrationData.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{registrationData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Phone:</span>
            <span>{registrationData.phone}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold">
            <span>Registration Fee:</span>
            <span>${(amount / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <PaymentForm
        amount={amount}
        onSuccess={handlePaymentSuccess}
        onError={onError}
        loading={isProcessing}
        title="Payment Information"
        description="Enter your card details to complete your registration"
      />
    </div>
  );
}; 