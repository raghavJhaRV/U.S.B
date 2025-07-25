"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { API_URL } from "../../constants";
import HelcimPaymentForm from "../../components/HelcimPaymentForm";

type CheckoutData = {
  productId: string;
  productName: string;
  price: number;
  size: string;
  quantity: number;
  imageUrl: string;
  total: number;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setCheckoutData(decodedData);
      } catch (err) {
        setError('Invalid checkout data');
      }
    } else {
      setError('No product data provided');
    }
    setLoading(false);
  }, [searchParams]);

  const handlePaymentSuccess = (payment: any) => {
    // Create order in database
    createOrder(payment);
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  const createOrder = async (payment: any) => {
    if (!checkoutData) return;

    try {
      const orderData = {
        productId: checkoutData.productId,
        productName: checkoutData.productName,
        size: checkoutData.size,
        quantity: checkoutData.quantity,
        total: checkoutData.total,
        paymentId: payment.id,
        customerEmail: payment.customerEmail,
        customerName: payment.customerName,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Redirect to success page
        window.location.href = `/merchandise/success?orderId=${payment.id}`;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Payment successful but order creation failed. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-6"></div>
            <div className="h-64 bg-gray-800 rounded mb-6"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !checkoutData) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Checkout Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Unable to load checkout data'}</p>
          <a 
            href="/merchandise" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Return to Merchandise
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <Image
                src={checkoutData.imageUrl}
                alt={checkoutData.productName}
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div>
                <h3 className="font-semibold">{checkoutData.productName}</h3>
                <p className="text-gray-400">Size: {checkoutData.size}</p>
                <p className="text-gray-400">Quantity: {checkoutData.quantity}</p>
                <p className="text-blue-400 font-semibold">${checkoutData.price.toFixed(2)} each</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${checkoutData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-700 pt-2">
                <span>Total:</span>
                <span className="text-blue-400">${checkoutData.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {customerName && customerEmail && (
              <HelcimPaymentForm
                amount={checkoutData.total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerEmail={customerEmail}
                customerName={customerName}
                orderNumber={`MERCH-${Date.now()}`}
                comments={`${checkoutData.productName} - Size: ${checkoutData.size} - Qty: ${checkoutData.quantity}`}
                allowSaveCard={true}
              />
            )}
          </div>
        </div>

        {/* Return Link */}
        <div className="text-center mt-8">
          <a 
            href="/merchandise" 
            className="text-gray-400 hover:text-white transition"
          >
            ← Return to Merchandise
          </a>
        </div>
      </div>
    </div>
  );
} 