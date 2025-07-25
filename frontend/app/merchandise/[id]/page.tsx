"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { API_URL } from "../../constants";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/merchandise`);
        if (!response.ok) {
          throw new Error('Failed to fetch merchandise');
        }
        const products = await response.json();
        
        // Find the product by ID
        const foundProduct = products.find((p: Product) => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleBuyNow = () => {
    // For now, redirect to a payment form or show a message
    // You can replace this with your payment integration
    if (!selectedSize) return;
    window.location.href = `/merchandise/${id}/buy?size=${selectedSize}&qty=${quantity}`;
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-800 rounded mb-6"></div>
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-6 bg-gray-800 rounded mb-8"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-red-400 mb-4">Product Not Found</h1>
          <p className="text-gray-300 mb-8">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <a 
            href="/merchandise" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Back to Merchandise
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-800">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized={true}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                          <svg class="w-24 h-24 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                          </svg>
                          <p class="text-white text-lg">Image Not Available</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-blue-400 mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Size</h3>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border-2 px-4 py-2 rounded-lg transition ${
                      selectedSize === size
                        ? "border-blue-400 bg-blue-400 text-black"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-gray-800 transition"
                >
                  -
                </button>
                <span className="text-xl font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-gray-800 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buy Now */}
            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize || product.stock === 0}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition ${
                  !selectedSize || product.stock === 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {product.stock === 0 
                  ? "Out of Stock" 
                  : !selectedSize 
                    ? "Select Size" 
                    : "Buy Now"
                }
              </button>
              <div className="text-sm text-gray-400 text-center">
                <p>Free shipping on orders over $50</p>
                <p>30-day return policy</p>
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <span className="font-medium">Category:</span> {product.category}
                </div>
                <div>
                  <span className="font-medium">Stock:</span> {product.stock} units
                </div>
                <div>
                  <span className="font-medium">Added:</span> {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Merchandise */}
        <div className="text-center mt-12">
          <a 
            href="/merchandise" 
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition"
          >
            ← Back to All Merchandise
          </a>
        </div>
      </div>
    </div>
  );
}
