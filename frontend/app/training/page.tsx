"use client";
import Link from "next/link";

const trainings = [
  {
    title: "2025 Fall Elite Training",
    subtitle: "September 2 – October 28",
    image: "/images/fall.jpg",
    href: "/training/fall",
  },
  {
    title: "Sunday Spring Training",
    subtitle: "April – June Sundays",
    image: "/images/spring.jpg",
    href: "/training/spring",
  },
  {
    title: "1-on-1 Training",
    subtitle: "Private Coaching Sessions",
    image: "/images/1on1.jpg",
    href: "/training/1on1",
  },
  {
    title: "Shooting Machine Sessions",
    subtitle: "Improve Your Shooting",
    image: "/images/shooting.jpg",
    href: "/training/shooting",
  },
];

export default function TrainingPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold uppercase">Training Sessions</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {trainings.map((t, i) => (
          <Link key={i} href={t.href}>
            <div className="relative group h-[280px] cursor-pointer overflow-hidden bg-gray-800">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 scale-100 group-hover:scale-105"
                style={{ backgroundImage: `url(${t.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                <p className="text-sm uppercase text-white opacity-80 mb-1">{t.subtitle}</p>
                <h2 className="font-extrabold text-lg leading-tight uppercase">{t.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
