"use client";
import Image from "next/image";

const photos = [
  "/images/boys_registration.jpg",
  "/images/image1.jpg",
  "/images/image4.jpg",
  "/images/image3.jpg"

  // Add as many as you'd like
];

export default function TournamentAlbum() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold text-center uppercase mb-8"> Photo Album</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {photos.map((src, idx) => (
          <div key={idx} className="overflow-hidden rounded">
            <Image
              src={src}
              alt={`Tournament Photo ${idx + 1}`}
              width={500}
              height={300}
              className="object-cover w-full h-64 hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
