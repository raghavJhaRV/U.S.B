"use client";
import Link from "next/link";
import { DEFAULT_IMAGE } from "../constants";
import Image from "next/image";

const trainings = [
  {
    title: "2025 Fall Elite Training",
    subtitle: "September 2 – October 28",
    image: 'images/media1.jpg',
    href: "/training/fall",
  },
  {
    title: "Sunday Spring Training",
    subtitle: "April – June Sundays",
    image: 'images/media1.jpg',
    href: "/training/spring",
  },
  {
    title: "1-on-1 Training",
    subtitle: "Private Coaching Sessions",
    image: DEFAULT_IMAGE,
    href: "/training/1on1",
  },
  {
    title: "Shooting Machine Sessions",
    subtitle: "Improve Your Shooting",
    image: DEFAULT_IMAGE,
    href: "/training/shooting",
  },
];

export default function TrainingPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase">Training Sessions</h1>
        <p className="mt-2 text-sm text-gray-400 uppercase">Elevate your game with us</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {trainings.map((t, i) => (
          <Link key={i} href={t.href}>
            <div className="relative h-[300px] group overflow-hidden rounded-lg shadow-lg cursor-pointer">
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${t.image})` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-40 transition duration-300" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                <p className="text-sm uppercase text-gray-300 mb-1">{t.subtitle}</p>
                <h2 className="text-xl font-bold uppercase leading-tight">{t.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
