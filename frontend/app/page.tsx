"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_IMAGE, API_URL } from "./constants";
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Player = {
  id: string;
  name: string;
  imageUrl?: string;
  achievements?: string;
  year?: string;
};

export default function Home() {
  const [hallOfFame, setHallOfFame] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use mock data since we don't have a Hall of Fame API endpoint
    // In the future, you can replace this with: fetch(`${API_URL}/api/hall-of-fame`)
    const mockHallOfFame: Player[] = [
      { id: "1", name: "Kyler Varga", imageUrl: "/image.webp" },
      { id: "2", name: "Ike Imegwu", imageUrl: "/image1.jpg" },
      { id: "3", name: "Angela Lee", imageUrl: "/hof3.jpg" },
      { id: "4", name: "Sam Nichols", imageUrl: "/hof4.jpg" },
      { id: "5", name: "Wol Wol", imageUrl: "/hof4.jpg" },
      { id: "6", name: "Kyler Varga", imageUrl: "/hof1.jpg" },
      { id: "7", name: "Ike", imageUrl: "/hof2.jpg" },
      { id: "8", name: "Angela Lee", imageUrl: "/hof3.jpg" },
      { id: "9", name: "Sam Nichols", imageUrl: "/hof4.jpg" },
      { id: "10", name: "Wol Wol", imageUrl: "/hof4.jpg" },
    ];
    
    setHallOfFame(mockHallOfFame);
    setLoading(false);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src={DEFAULT_IMAGE}
          alt="Basketball Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 sm:px-20">
          <h1 className="text-5xl sm:text-6xl font-extrabold uppercase">
            United S.T.O.R.M. Basketball
          </h1>
          <div className="mt-6 flex gap-4">
            <a
              href="/registration"
              className="bg-white text-black font-bold px-6 py-3 rounded-md hover:bg-gray-200"
            >
              REGISTER NOW
            </a>
          </div>
          <div className="absolute bottom-6 flex gap-4">
            <a
              href="https://www.instagram.com/united.storm.basketball"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.facebook.com/unitedstormbasketball/?ref=_xav_ig_profile_page_web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-gray-100 text-black py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Player Highlights */}
          <div className="bg-white shadow-lg p-6 text-center">
            <h2 className="font-bold text-xl mb-4">PLAYER HIGHLIGHTS</h2>
            <img src={DEFAULT_IMAGE} alt="Highlight" className="mb-4 w-full h-40 object-cover" />
            <Link href="/player-highlights">
              <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition">
                JOIN A TEAM
              </button>
            </Link>
          </div>

          {/* Events */}
          <div className="bg-white shadow-lg p-6 text-center">
            <h2 className="font-bold text-xl mb-4">EVENTS</h2>
            <img src={DEFAULT_IMAGE} alt="Tournaments" className="mb-4 w-full h-40 object-cover" />
            <Link href="/events">
              <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition">
                VIEW SCHEDULE
              </button>
            </Link>
          </div>

          {/* Latest News */}
          <div className="bg-white shadow-lg p-6 text-center">
            <h2 className="font-bold text-xl mb-4">LATEST NEWS</h2>
            <img src={DEFAULT_IMAGE} alt="News" className="mb-4 w-full h-40 object-cover" />
            <span className="text-gray-500 text-sm block mb-4">April 23, 2015</span>
            <Link href="/news">
              <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition">
                READ MORE
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-10 uppercase">Hall of Fame</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-pulse space-x-6 flex">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-48 sm:w-52 md:w-60 text-center">
                    <div className="w-full h-48 bg-gray-800 rounded-md shadow-md mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 scrollbar-hide px-2 sm:px-6">
              {hallOfFame.map((player) => (
                <div key={player.id} className="flex-shrink-0 w-48 sm:w-52 md:w-60 text-center">
                  <img
                    src={player.imageUrl || DEFAULT_IMAGE}
                    alt={player.name}
                    className="w-full h-48 object-cover rounded-md shadow-md"
                  />
                  {player.name && (
                    <p className="mt-2 text-sm font-bold uppercase text-center">
                      {player.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

