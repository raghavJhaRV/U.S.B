"use client";
import Image from "next/image";
import Link from "next/link";

const partners = new Array(12).fill("/images/partner-logo.png"); // Replace with real logo paths

export default function PartnersPage() {
  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-center uppercase mb-12">Proud Partners</h1>

      {/* Partner Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
        {partners.map((logo, i) => (
          <div
            key={i}
            className="bg-gray-800 flex items-center justify-center h-28 rounded-md border border-gray-600"
          >
            <Image
              src={logo}
              alt={`Partner logo ${i + 1}`}
              width={100}
              height={60}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mb-20">
        <h2 className="text-xl font-semibold mb-4">
          Interested in becoming a sponsor?
        </h2>
        <Link
          href="/sponsor-us"
          className="inline-block border border-white px-6 py-2 font-bold rounded hover:bg-white hover:text-black transition"
        >
          Sponsor Us
        </Link>
      </div>
    </div>
  );
}
