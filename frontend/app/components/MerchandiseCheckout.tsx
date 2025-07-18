'use client';

import { useState, useEffect } from 'react';
import { PaymentForm } from './PaymentForm';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface MerchandiseCheckoutProps {
  items: CartItem[];
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export const MerchandiseCheckout = ({ items, onSuccess, onError }: MerchandiseCheckoutProps) => {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    setIsProcessing(true);
    
    try {
      // Create payment intent on the server
      const response = await fetch('/api/payments/merchandise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail,
          customerName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();
      
      // Confirm the payment
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm payment');
      }

      onSuccess(paymentIntentId);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">${(item.price * item.quantity / 100).toFixed(2)}</p>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${(totalAmount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information & Payment */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <PaymentForm
            amount={totalAmount}
            onSuccess={handlePaymentSuccess}
            onError={onError}
            loading={isProcessing}
            title="Payment Information"
            description="Enter your card details to complete your purchase"
          />
        </div>
      </div>
    </div>
  );
}; 