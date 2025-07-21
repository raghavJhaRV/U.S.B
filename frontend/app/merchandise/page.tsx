"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "../constants";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  isActive: boolean;
};

export default function MerchandisePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/merchandise`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch merchandise");
        return res.json();
      })
      .then((data) => {

        // Filter only active products
        const activeProducts = data.filter((product: Product) => product.isActive);
        setProducts(activeProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load merchandise:", err);
        setLoading(false);
        setProducts([]);
      });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-10">
          Merchandise
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="w-full h-64 bg-gray-800 rounded mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🏀</div>
            <h3 className="text-xl font-bold mb-2">No Merchandise Available</h3>
            <p>Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {products.map((item) => (
              <Link key={item.id} href={`/merchandise/${item.id}`}>
                <div className="text-center cursor-pointer hover:opacity-80 transition">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full object-cover mb-4"
                  />
                  <p className="font-bold uppercase tracking-wide">{item.name}</p>
                  <p className="text-gray-400">${item.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


