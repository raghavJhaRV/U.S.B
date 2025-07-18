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
        console.log("Fetched merchandise from API:", data);
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
          <div className="text-center text-gray-400">Loading merchandise...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400">No merchandise available.</div>
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


