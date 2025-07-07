"use client";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons'

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
      title: " PHOTO ALBUM",
      image: "/images/media1.jpg",
      link: "/media/album", 
    },
    {
      type: "WATCH",
      title: "VIRTUAL TRAINING",
      image: "/images/media1.jpg",
      link: "https://www.youtube.com/watch?v=mQuwGHfm9dk&embeds_referring_euri=https%3A%2F%2Fusbball.ca%2F&source_ve_path=Mjg2NjYD",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Media</h1>

        {/* <div className="flex justify-center gap-4 mb-10 text-2xl">
          <a href="#" className="hover:opacity-80"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#" className="hover:opacity-80"><FontAwesomeIcon icon={faFacebookF} /></a>
        </div> */}

        <h2 className="text-xl font-bold uppercase mb-6">Media Gallery</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mediaItems.map((item, idx) => {
            const card = (
              <div className="relative group cursor-pointer">
                <div className="w-full h-64 overflow-hidden relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={256}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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
