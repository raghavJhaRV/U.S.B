"use client";

import { useState, useEffect } from 'react';
import { API_URL } from '../constants';

interface HelcimPaymentFormProps {
  amount: number;
  onSuccess: (payment: any) => void;
  onError: (error: string) => void;
  customerEmail?: string;
  customerName?: string;
  orderNumber?: string;
  comments?: string;
  allowSaveCard?: boolean;
}

interface SavedCard {
  cardToken: string;
  lastFour: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
}

export default function HelcimPaymentForm({
  amount,
  onSuccess,
  onError,
  customerEmail,
  customerName,
  orderNumber,
  comments,
  allowSaveCard = true,
}: HelcimPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardToken, setSelectedCardToken] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // New card form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    if (customerEmail) {
      loadSavedCards();
    }
  }, [customerEmail]);

  const loadSavedCards = async () => {
    try {
      // This would need to be implemented based on your customer identification
      // For now, we'll use a simple approach
      const response = await fetch(`${API_URL}/api/payments/saved-cards/${customerEmail}`);
      if (response.ok) {
        const data = await response.json();
        setSavedCards(data.cards || []);
      }
    } catch (error) {
      console.error('Failed to load saved cards:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let paymentData: any = {
        amount,
        customerEmail,
        customerName,
        orderNumber,
        comments,
        saveCard: allowSaveCard && saveCard,
      };

      if (useSavedCard && selectedCardToken) {
        // Use saved card
        paymentData.cardToken = selectedCardToken;
      } else {
        // Use new card
        if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholderName) {
          throw new Error('Please fill in all card details');
        }

        paymentData.cardData = {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryMonth,
          expiryYear,
          cvv,
          cardholderName,
        };
      }

      const response = await fetch(`${API_URL}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.payment);
        
        // If card was saved, refresh saved cards list
        if (result.cardToken && allowSaveCard) {
          await loadSavedCards();
        }
      } else {
        onError(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Payment Information</h3>
      <p className="text-gray-300 mb-6">Total: ${amount.toFixed(2)} CAD</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Saved Cards Section */}
        {savedCards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useSavedCard"
                checked={useSavedCard}
                onChange={(e) => setUseSavedCard(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-blue-500"
              />
              <label htmlFor="useSavedCard" className="text-sm font-medium">
                Use saved card
              </label>
            </div>

            {useSavedCard && (
              <div className="space-y-2">
                {savedCards.map((card) => (
                  <div
                    key={card.cardToken}
                    className={`p-3 border rounded-lg cursor-pointer transition ${
                      selectedCardToken === card.cardToken
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedCardToken(card.cardToken)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {card.cardType} •••• {card.lastFour}
                        </p>
                        <p className="text-sm text-gray-400">
                          Expires {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="selectedCard"
                        value={card.cardToken}
                        checked={selectedCardToken === card.cardToken}
                        onChange={(e) => setSelectedCardToken(e.target.value)}
                        className="text-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Card Form */}
        {(!useSavedCard || savedCards.length === 0) && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Month
                </label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Year
                </label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* Save Card Option */}
        {allowSaveCard && (!useSavedCard || savedCards.length === 0) && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-blue-500"
            />
            <label htmlFor="saveCard" className="text-sm text-gray-300">
              Save this card for future payments
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition ${
            isProcessing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)} CAD`}
        </button>

        {/* Security Notice */}
        <div className="text-xs text-gray-400 text-center">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>No transaction fees • PCI compliant • Canadian-based</p>
        </div>
      </form>
    </div>
  );
} 