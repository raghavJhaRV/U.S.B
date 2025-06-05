"use client";

import { DEFAULT_IMAGE } from "../constants";
import Image from "next/image";

import Link from "next/link";

const events = [
  { name: "Spring Showdown", slug: "spring-showdown", date: "April 7–9" },
  { name: "Fall Classic", slug: "fall-classic", date: "October 19–15" },
  { name: "Winter Invitational", slug: "winter-invitational", date: "January 19–21" },
];

export default function EventsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold uppercase text-center mb-10">Events</h1>
      <h2 className="text-xl font-bold mb-6">Upcoming Tournaments</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.slug} className="bg-black border border-white p-4 text-center">
            <h3 className="font-bold text-lg mb-1">{event.name}</h3>
            <p className="text-sm mb-4">{event.date}</p>
            <Link
              href={`/events/${event.slug}`}
              className="border px-4 py-2 font-bold hover:bg-white hover:text-black transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
