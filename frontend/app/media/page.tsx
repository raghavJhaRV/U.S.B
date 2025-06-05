"use client";
import Image from "next/image";

export default function MediaPage() {
  const mediaItems = [
    {
      type: "WATCH",
      title: "HIGHLIGHT REEL",
      image: "/images/media1.jpg",
      link: "https://www.youtube.com/watch?v=vnnCEmnsvgc",
    },
    {
      type: "PHOTO",
      title: "TOURNAMENT PHOTO ALBUM",
      image: "/images/media1.jpg",
    },
    {
      type: "WATCH",
      title: "VIRTUAL TRAINING",
      image: "/images/media1.jpg",
      link: "https://www.youtube.com/watch?v=PEHMuGS-z3Y&pp=ygUXdW5pdGVkIHN0b3JtIGJhc2tldGJhbGw%3D",
    },
    {
      type: "WATCH",
      title: "Highlight Reel",
      image: "/images/media1.jpg",
      link: "https://www.youtube.com/watch?v=ofzPz4xpT6c",
    },
    {
      type: "",
      title: "DAVID JOHNSON",
      image: "/images/media1.jpg",
    },
    {
      type: "WATCH",
      title: "ANGELA LEE",
      image: "/images/media1.jpg",
      link: "https://www.youtube.com/watch?v=D3LzryYql-I",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Media</h1>

        <div className="flex justify-center gap-4 mb-10 text-2xl">
          <a href="#" className="hover:opacity-80">📷</a>
          <a href="#" className="hover:opacity-80">📘</a>
        </div>

        <h2 className="text-xl font-bold uppercase mb-6">Media Gallery</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mediaItems.map((item, idx) => {
            const card = (
              <div className="relative group cursor-pointer">
                <div className="w-full h-64 overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 left-4 text-left">
                  {item.type && (
                    <p className="text-xs text-white font-medium uppercase">
                      {item.type}
                    </p>
                  )}
                  <h3 className="text-lg font-bold uppercase leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            );

            return item.link ? (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {card}
              </a>
            ) : (
              <div key={idx}>{card}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
