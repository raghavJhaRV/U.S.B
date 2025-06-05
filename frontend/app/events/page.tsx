"use client";

import Link from "next/link";
import { DEFAULT_IMAGE } from "../constants"; // or use "/images/media1.jpg"

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
      <h1 className="text-4xl font-extrabold text-center mb-12 uppercase">Events</h1>
      <h2 className="text-2xl font-bold uppercase mb-6">Upcoming Tournaments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.slug} className="bg-black group shadow-lg">
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            ></div>
            <div className="p-4">
              <p className="font-bold text-lg uppercase leading-tight">{event.title}</p>
              <p className="text-sm text-gray-400 mb-4">{event.date}</p>
              <Link
                href={`/events/${event.slug}`}
                className="border px-4 py-2 inline-block font-bold hover:bg-white hover:text-black transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
