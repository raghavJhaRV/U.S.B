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
    // Define your dummy data
    const dummyEvents: Event[] = [
      {
        id: "event1",
        title: "Annual Basketball Tournament",
        date: "2025-08-20T10:00:00Z", // Use ISO format for easy Date object creation
        team: { id: "teamA", ageGroup: "U18", gender: "Male" },
      },
      {
        id: "event2",
        title: "Summer Soccer Camp",
        date: "2025-07-25T09:00:00Z",
        team: { id: "teamB", ageGroup: "U12", gender: "Female" },
      },
      {
        id: "event3",
        title: "Fall Track & Field Meet",
        date: "2025-09-10T14:30:00Z",
      },
      {
        id: "event4",
        title: "Winter Hoops Challenge",
        date: "2025-12-01T18:00:00Z",
      },
      {
        id: "event5",
        title: "Spring Marathon",
        date: "2026-04-15T07:00:00Z",
      },
    ];

    // Simulate an API call delay
    const timer = setTimeout(() => {
      setEvents(dummyEvents);
      setLoading(false);
    }, 1000); // Simulate a 1-second loading time

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
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