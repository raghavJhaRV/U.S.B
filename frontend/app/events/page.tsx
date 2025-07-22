"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_IMAGE, API_URL } from "../constants"; // fallback image

type Event = {
  id: string;
  title: string;
  date: string;
  livestreamUrl?: string;
  team?: { id: string; ageGroup: string; gender: string }; // optional if included
};

export default function EventsPage() {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events from API
    fetch(`${API_URL}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        // Check if data is an array before setting events
        if (!Array.isArray(data)) {
          console.error('Expected array but received:', data);
          throw new Error('Invalid data format received from server');
        }

        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setLoading(false);
        // Fallback to empty array if API fails
        setEvents([]);
      });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12 uppercase">Events</h1>
      
      {/* Live Streams Section */}
      {events.some(event => event.livestreamUrl) && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold uppercase">Live Streams</h2>
            <Link
              href="/livestream"
              className="border border-white px-4 py-2 font-bold hover:bg-white hover:text-black transition"
            >
              Watch All Streams
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events
              .filter(event => event.livestreamUrl)
              .slice(0, 3) // Show only first 3 livestream events
              .map((event) => (
                <div key={event.id} className="bg-black group shadow-lg border border-red-500">
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${DEFAULT_IMAGE})` }}
                  >
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
                      LIVE
                    </div>
                  </div>
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
                      href="/livestream"
                      className="border border-red-500 px-4 py-2 inline-block font-bold hover:bg-red-500 hover:text-white transition"
                    >
                      Watch Live
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
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