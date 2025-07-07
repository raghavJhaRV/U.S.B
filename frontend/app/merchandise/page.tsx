"use client";
import Link from "next/link";
import { products } from "./products";

export default function MerchandisePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-10">
          Merchandise
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {products.map((item) => (
            <Link key={item.id} href={`/merchandise/${item.id}`}>
              <div className="text-center cursor-pointer hover:opacity-80 transition">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover mb-4"
                />
                <p className="font-bold uppercase tracking-wide">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}


