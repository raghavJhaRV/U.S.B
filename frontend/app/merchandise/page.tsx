"use client";

import { DEFAULT_IMAGE } from "../constants"; // Assume this = "/images/media1.jpg"

const products = [
  {
    title: "Legends Jersey",
  },
  {
    title: "Classic T-Shirt",
  },
  {
    title: "Legends Hoodie",
  },
  {
    title: "Icon Snapback",
  },
];

export default function MerchandisePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-10">
          Merchandise
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {products.map((item, index) => (
            <div key={index} className="text-center">
              <img
                src={DEFAULT_IMAGE}
                alt={item.title}
                className="w-full object-cover mb-4"
              />
              <p className="font-bold uppercase tracking-wide">{item.title}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
