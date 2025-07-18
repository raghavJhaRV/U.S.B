"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { API_URL } from "../constants";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  createdAt: string;
};

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/media`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch media");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched media from API:", data);
        setMediaItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load media:", err);
        setLoading(false);
        setMediaItems([]);
      });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Media</h1>

        {/* <div className="flex justify-center gap-4 mb-10 text-2xl">
          <a href="#" className="hover:opacity-80"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#" className="hover:opacity-80"><FontAwesomeIcon icon={faFacebookF} /></a>
        </div> */}

        {loading ? (
          <div className="text-center text-gray-400">Loading media...</div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center text-gray-400">No media available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div key={item.id} className="relative group cursor-pointer">
                <div className="w-full h-64 overflow-hidden relative">
                  <Image
                    src={item.url}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
