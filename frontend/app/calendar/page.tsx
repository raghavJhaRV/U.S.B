// frontend/src/app/calendar/page.tsx

"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";
import { API_URL } from "../constants";

type Event = {
  id: string;
  title: string;
  date: string;
  team?: {
    gender: string;
    ageGroup: string;
  };
};

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched events for calendar:", data);
        const calendarEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date).toISOString().split('T')[0],
          team: event.team
        }));
        setEvents(calendarEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  const handleCalendarChange = (value: CalendarValue) => {
    if (value instanceof Date || value === null) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      setSelectedDate(value[0] instanceof Date ? value[0] : null);
    }
  };

  const eventsForDate = selectedDate
    ? events.filter((e) => new Date(e.date).toDateString() === selectedDate.toDateString())
    : [];

  const getEventsForDate = (date: Date) => {
    return events.filter((e) => new Date(e.date).toDateString() === date.toDateString());
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white min-h-screen px-4 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-700 rounded mb-8"></div>
            <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-32 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white min-h-screen px-4 py-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
          <span className="text-3xl">🗓️</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Event Calendar
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Stay updated with all our upcoming events, tournaments, and activities
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Select a Date</h2>
                <p className="text-gray-400">Click on any date to view events</p>
              </div>
              
              <Calendar
                onChange={handleCalendarChange}
                value={selectedDate}
                className="beautiful-calendar"
                tileClassName={({ date }) => {
                  const dayEvents = getEventsForDate(date);
                  if (dayEvents.length > 0) {
                    return "has-events";
                  }
                  return null;
                }}
                tileContent={({ date }) => {
                  const dayEvents = getEventsForDate(date);
                  if (dayEvents.length > 0) {
                    return (
                      <div className="event-indicator">
                        <div className="event-dots">
                          {dayEvents.slice(0, 3).map((_, index) => (
                            <div key={index} className="event-dot" />
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </div>
          </div>

          {/* Events List Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8 h-fit">
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
              
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-gray-400">No events scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl p-4 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          {event.team && (
                            <span className="inline-block bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                              {event.team.gender} {event.team.ageGroup}U
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/events/${event.id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
                        >
                          →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Day Events */}
        {selectedDate && (
          <div className="mt-12">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Events on {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>

              {eventsForDate.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {eventsForDate.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl p-6 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                            {event.title}
                          </h3>
                          {event.team && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-blue-600/20 text-blue-300 text-sm px-3 py-1 rounded-full">
                                {event.team.gender} {event.team.ageGroup}U
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                          🏀
                        </div>
                      </div>
                      
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        View Details
                        <span className="text-lg">→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-400 text-lg">No events scheduled for this day</p>
                  <p className="text-gray-500 text-sm mt-2">Check back later for updates</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for the beautiful calendar */}
      <style jsx global>{`
        .beautiful-calendar {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          border: 1px solid rgba(75, 85, 99, 0.3);
          border-radius: 20px;
          padding: 20px;
          color: white;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .beautiful-calendar .react-calendar__navigation {
          margin-bottom: 20px;
        }

        .beautiful-calendar .react-calendar__navigation button {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          padding: 12px 16px;
          margin: 0 4px;
          transition: all 0.3s ease;
          min-width: 44px;
        }

        .beautiful-calendar .react-calendar__navigation button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }

        .beautiful-calendar .react-calendar__navigation button:disabled {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          opacity: 0.5;
        }

        .beautiful-calendar .react-calendar__month-view__weekdays {
          margin-bottom: 10px;
        }

        .beautiful-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 10px 0;
          text-align: center;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
        }

        .beautiful-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          border-bottom: none;
        }

        .beautiful-calendar .react-calendar__tile {
          background: transparent;
          border: none;
          border-radius: 12px;
          color: #e5e7eb;
          font-weight: 500;
          padding: 12px 8px;
          margin: 2px;
          transition: all 0.3s ease;
          position: relative;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .beautiful-calendar .react-calendar__tile:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .beautiful-calendar .react-calendar__tile--now {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
        }

        .beautiful-calendar .react-calendar__tile--active,
        .beautiful-calendar .react-calendar__tile--active:enabled:hover,
        .beautiful-calendar .react-calendar__tile--active:enabled:focus {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }

        .beautiful-calendar .react-calendar__tile--hasEvents {
          position: relative;
        }

        .event-indicator {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .event-dots {
          display: flex;
          gap: 2px;
          justify-content: center;
        }

        .event-dot {
          width: 4px;
          height: 4px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        .beautiful-calendar .react-calendar__tile--neighboringMonth {
          color: #6b7280;
          opacity: 0.5;
        }

        .beautiful-calendar .react-calendar__tile:enabled:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .beautiful-calendar {
            padding: 15px;
          }
          
          .beautiful-calendar .react-calendar__tile {
            padding: 8px 4px;
            min-height: 50px;
            font-size: 0.875rem;
          }
          
          .beautiful-calendar .react-calendar__navigation button {
            padding: 8px 12px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}