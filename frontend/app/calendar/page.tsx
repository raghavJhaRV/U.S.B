"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  date: string;
};

// 1. Define your mock data array.
// Using ISO 8601 format (YYYY-MM-DD) for dates is reliable.
const mockEvents: Event[] = [
  { id: "1", title: "Project Alpha Kick-off", date: "2025-07-10" },
  { id: "2", title: "Quarterly Review", date: "2025-07-17" },
  { id: "3", title: "Design Sprint Finale", date: "2025-07-17" },
  { id: "4", title: "Summer Team Outing", date: "2025-07-25" },
];


export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // 2. Instead of fetching, just set the state with the mock data.
    setEvents(mockEvents);

    /*
    // --- Original Fetch Call (now disabled) ---
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error("Failed to fetch events:", err));
    */
  }, []);

  const eventsForDate = selectedDate
    ? events.filter((e) => new Date(e.date).toDateString() === selectedDate.toDateString())
    : [];

  return (
    <div className="bg-black text-white min-h-screen px-4 py-16">
      <h1 className="text-5xl font-extrabold text-center mb-12 uppercase tracking-wide">
        🗓️ Calendar of Events
      </h1>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="dark-calendar" // Note: prop is 'className', not 'calendarClassName'
          tileClassName={({ date }) => {
            // This logic now works because `events` state is populated
            const hasEvent = events.some(
              (e) => new Date(e.date).toDateString() === date.toDateString()
            );
            return hasEvent ? "event-day" : null;
          }}
        />
      </div>

      {/* Selected Day Events */}
      {selectedDate && (
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">
            Events on{" "}
            <span className="underline decoration-dotted">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </h2>
          {eventsForDate.length > 0 ? (
            <ul className="space-y-4">
              {eventsForDate.map((event) => (
                <li
                  key={event.id}
                  className="border border-white p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
                >
                  <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm text-blue-400 underline hover:text-blue-300"
                  >
                    View Details →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">No events scheduled for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}