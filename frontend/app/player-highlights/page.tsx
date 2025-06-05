"use client";

import Image from "next/image";
// import Link from "next/link";

export default function PlayerHighlights() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold uppercase mb-6 text-center">
          Player Highlights
        </h1>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-10">
          <a href="#" className="text-2xl hover:scale-110 transition">📸</a>
          <a href="#" className="text-2xl hover:scale-110 transition">📘</a>
        </div>

        {/* MEDIA GALLERY */}
        <h2 className="text-2xl font-bold mb-6 uppercase">Media Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Row 1 */}
          <MediaCard type="WATCH" title="Highlight Reel" image="/media1.jpg" />
          <MediaCard type="PHOTO" title="Tournament Photo Album" image="/media2.jpg" />
          <MediaCard type="WATCH" title="Virtual Training" image="/media3.jpg" />

          {/* Row 2 */}
          <JoinCard title="Join a Team" button="Join A Team" image="/media4.jpg" />
          <JoinCard title="Join a Team" button="Join ATE" image="/media5.jpg" />
          <NewsCard date="April 20, 2024" button="Read More" image="/media6.jpg" />
        </div>
      </div>
    </div>
  );
}

function MediaCard({ type, title, image }: any) {
  return (
    <div className="relative overflow-hidden">
      <Image src={image} alt={title} width={400} height={300} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
        <span className="text-xs uppercase font-semibold">{type}</span>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
}

function JoinCard({ title, button, image }: any) {
  return (
    <div className="relative overflow-hidden">
      <Image src={image} alt={title} width={400} height={300} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold mb-2 uppercase">{title}</h3>
        <button className="border border-white px-4 py-1 text-sm font-bold hover:bg-white hover:text-black transition">
          {button}
        </button>
      </div>
    </div>
  );
}

function NewsCard({ date, button, image }: any) {
  return (
    <div className="relative overflow-hidden">
      <Image src={image} alt="news" width={400} height={300} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
        <span className="text-sm font-semibold mb-1">{date}</span>
        <button className="border border-white px-4 py-1 text-sm font-bold hover:bg-white hover:text-black transition">
          {button}
        </button>
      </div>
    </div>
  );
}
