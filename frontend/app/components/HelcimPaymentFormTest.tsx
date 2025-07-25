"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../constants";

interface HelcimPaymentFormTestProps {
  amount: number;
  onSuccess: (payment: any) => void;
  onError: (error: string) => void;
  customerEmail?: string;
  customerName?: string;
  orderNumber?: string;
  comments?: string;
  allowSaveCard?: boolean;
}

export default function HelcimPaymentFormTest({
  amount,
  onSuccess,
  onError,
  customerEmail,
  customerName,
  orderNumber,
  comments,
  allowSaveCard = true,
}: HelcimPaymentFormTestProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardToken, setSelectedCardToken] = useState("");
  const [helcimConfigured, setHelcimConfigured] = useState(true); // Assume configured by default

  const loadSavedCards = useCallback(async () => {
    if (!customerEmail) return;
    
    try {
      const response = await fetch(`${API_URL}/api/test-payments/saved-cards?customerEmail=${customerEmail}`);
      if (response.ok) {
        const cards = await response.json();
        setSavedCards(cards);
      }
    } catch (error) {
      console.error("Error loading saved cards:", error);
    }
  }, [customerEmail]);

  useEffect(() => {
    if (customerEmail) {
      loadSavedCards();
    }
  }, [customerEmail, loadSavedCards]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
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
          throw new Error("Please fill in all card details");
        }

        paymentData.cardData = {
          cardNumber: cardNumber.replace(/\s/g, ""),
          expiryMonth,
          expiryYear,
          cvv,
          cardholderName,
        };
      }

      console.log("🧪 Using TEST payment endpoint");
      const response = await fetch(`${API_URL}/api/test-payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        onError(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError(error instanceof Error ? error.message : "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-4 p-3 bg-yellow-900 border border-yellow-700 rounded">
        <p className="text-yellow-200 text-sm">
          🧪 <strong>TEST MODE</strong> - This is using the test payment endpoint. 
          No real payments will be processed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Saved Cards Section */}
        {savedCards.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Use Saved Card
            </label>
            <div className="space-y-2">
              {savedCards.map((card) => (
                <label key={card.cardToken} className="flex items-center">
                  <input
                    type="radio"
                    name="savedCard"
                    value={card.cardToken}
                    checked={useSavedCard && selectedCardToken === card.cardToken}
                    onChange={(e) => {
                      setUseSavedCard(true);
                      setSelectedCardToken(e.target.value);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {card.cardType.toUpperCase()} •••• {card.lastFour} 
                    (Expires {card.expiryMonth}/{card.expiryYear})
                  </span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="savedCard"
                  checked={!useSavedCard}
                  onChange={() => setUseSavedCard(false)}
                  className="mr-2"
                />
                <span className="text-sm">Use new card</span>
              </label>
            </div>
          </div>
        )}

        {/* New Card Form */}
        {!useSavedCard && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Month
                </label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month.toString().padStart(2, "0")}>
                      {month.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Year
                </label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
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
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Save Card Option */}
        {allowSaveCard && !useSavedCard && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="saveCard" className="text-sm">
              Save this card for future payments
            </label>
          </div>
        )}

        {/* Test Card Numbers Info */}
        <div className="bg-blue-900 border border-blue-700 rounded p-3">
          <p className="text-blue-200 text-sm font-medium mb-2">🧪 Test Card Numbers:</p>
          <ul className="text-blue-200 text-xs space-y-1">
            <li><strong>Success:</strong> 4111111111111111</li>
            <li><strong>Decline:</strong> 4000000000000002</li>
            <li><strong>Insufficient Funds:</strong> 4000000000009995</li>
            <li><strong>Expired Card:</strong> 4000000000000069</li>
          </ul>
          <p className="text-blue-200 text-xs mt-2">
            Use any future expiry date and any 3-digit CVV
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded transition duration-200"
        >
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)} CAD`}
        </button>
      </form>
    </div>
  );
} 