"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import Image from "next/image";
// import heroImage from "/public/hero.jpg"; // <-- Add this image to `public/hero.jpg`

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        {/* <Image
          src={heroImage}
          alt="Basketball Hero"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="opacity-60"
        /> */}
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
            <a href="#" className="text-white text-2xl">
              🟣
            </a>
            <a href="#" className="text-white text-2xl">
              🅕
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
            {/* <img src="/highlight.jpg" alt="Highlight" className="mb-4 w-full h-40 object-cover" /> */}
            <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition">
              JOIN A TEAM
            </button>
          </div>

          {/* Events */}
          <div className="bg-white shadow-lg p-6 text-center">
            <h2 className="font-bold text-xl mb-4">EVENTS</h2>
            {/* <img src="/tournament.jpg" alt="Tournaments" className="mb-4 w-full h-40 object-cover" /> */}
            <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition">
              VIEW SCHEDULE
            </button>
          </div>

          {/* Latest News */}
          <div className="bg-white shadow-lg p-6 text-center">
            <h2 className="font-bold text-xl mb-4">LATEST NEWS</h2>
            {/* <img src="/news.jpg" alt="News" className="mb-4 w-full h-40 object-cover" /> */}
            <p className="font-semibold mb-2">Lorem ipsum doldr sit amet</p>
            <span className="text-gray-500 text-sm block mb-4">April 23, 2015</span>
            <button className="border border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition">
              READ MORE
            </button>
          </div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-10 uppercase">Hall of Fame</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {/* Hall of Fame Card */}
            {[
              { name: "David Johnson", img: "/hof1.jpg" },
              { name: "Aingela Lee", img: "/hof2.jpg" },
              { name: "Angela Lee", img: "/hof3.jpg" },
              { name: "Sam Nichols", img: "/hof4.jpg" },
              { name: "", img: "/hof5.jpg" },
            ].map((player, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* <img
                  src={player.img}
                  alt={player.name}
                  className="w-full h-48 object-cover rounded-md shadow-md"
                /> */}
                {player.name && (
                  <p className="mt-2 text-sm font-bold uppercase text-center">
                    {player.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
