"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_IMAGE } from "../constants"; // fallback image

type Event = {
  id: string;
  title: string;
  date: string;
  team?: { id: string; ageGroup: string; gender: string }; // optional if included
};

export default function EventsPage() {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // Debug log to check env variable
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12 uppercase">Events</h1>
      <h2 className="text-2xl font-bold uppercase mb-6">Upcoming Tournaments</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-red-400">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-black group shadow-lg">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${DEFAULT_IMAGE})` }}
              ></div>
              <div className="p-4">
                <p className="font-bold text-lg uppercase leading-tight">{event.title}</p>
                <p className="text-sm text-gray-400 mb-4">
                  {new Date(event.date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="border px-4 py-2 inline-block font-bold hover:bg-white hover:text-black transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
