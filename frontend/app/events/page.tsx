"use client";

import Link from "next/link";
import { DEFAULT_IMAGE } from "../constants"; 

const events = [
  {
    slug: "spring-showdown",
    title: "Spring Showdown",
    date: "April 7–9",
    image: DEFAULT_IMAGE,
  },
  {
    slug: "fall-classic",
    title: "Fall Classic",
    date: "October 19–15",
    image: DEFAULT_IMAGE,
  },
  {
    slug: "winter-invitational",
    title: "Winter Invitational",
    date: "January 19–21",
    image: DEFAULT_IMAGE,
  },
];

export default function EventsPage() {
  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      <h2 className="text-2xl font-bold uppercase mb-6">Upcoming Tournaments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.slug} href={`/events/${event.slug}`}>
            <div className="relative group overflow-hidden shadow-lg cursor-pointer">
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${event.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
                  <p className="text-white text-xl font-extrabold uppercase leading-tight">
                    {event.title}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">{event.date}</p>
                  <div>
                    <span className="inline-block border border-white text-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
