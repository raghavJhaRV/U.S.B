"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    setOrderId(orderIdParam);
  }, [searchParams]);

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-300 text-lg mb-6">
          Thank you for your purchase. Your order has been confirmed and payment processed successfully.
        </p>
        
        {orderId && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="text-gray-400 mb-2">
              <span className="font-medium">Order ID:</span> {orderId}
            </p>
            <p className="text-gray-400 mb-2">
              <span className="font-medium">Status:</span> Payment Confirmed
            </p>
            <p className="text-gray-400">
              <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">What's Next?</h3>
          <ul className="text-left text-gray-300 space-y-2">
            <li>• You will receive an email confirmation shortly</li>
            <li>• Your order will be processed and shipped within 2-3 business days</li>
            <li>• You'll receive tracking information once your order ships</li>
            <li>• If you have any questions, please contact our support team</li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link 
            href="/merchandise"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </Link>
          
          <div>
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 