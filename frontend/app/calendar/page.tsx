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
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: string;
  livestreamUrl?: string;
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
        // Check if data is an array before calling map
        if (!Array.isArray(data)) {
          console.error('Expected array but received:', data);
          throw new Error('Invalid data format received from server');
        }

        const calendarEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString().split('T')[0],
          startTime: new Date(event.date).toISOString().split('T')[1].substring(0, 5),
          endTime: event.endTime ? new Date(event.date).toISOString().split('T')[1].substring(0, 5) : undefined,
          location: event.location,
          type: event.type,
          livestreamUrl: event.livestreamUrl,
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
      <div className="bg-black text-white min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-800 rounded mb-8"></div>
            <div className="h-96 bg-gray-800 rounded-lg mb-8"></div>
            <div className="h-32 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-wide">
          Event Calendar
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Stay updated with all our upcoming events, tournaments, and activities
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-black border border-gray-800 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold uppercase mb-2">Select a Date</h2>
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
            <div className="bg-black border border-gray-800 p-6 h-fit">
              <h2 className="text-2xl font-bold uppercase mb-6">Upcoming Events</h2>
              
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
                      className="bg-black border border-gray-800 p-4 hover:border-white transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1 line-clamp-2 uppercase">
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
                            <span className="inline-block bg-white text-black text-xs px-2 py-1 font-bold">
                              {event.team.gender} {event.team.ageGroup}U
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/events/${event.id}`}
                          className="text-white hover:text-gray-300 transition-colors ml-2 font-bold"
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
            <div className="bg-black border border-gray-800 p-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold uppercase mb-2">
                  Events on {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <div className="w-24 h-1 bg-white mx-auto"></div>
              </div>

              {eventsForDate.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {eventsForDate.map((event) => (
                    <div
                      key={event.id}
                      className="bg-black border border-gray-800 p-6 hover:border-white transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-white uppercase">
                              {event.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                              event.type === 'tournament' ? 'bg-purple-600 text-white' :
                              event.type === 'game' ? 'bg-blue-600 text-white' :
                              event.type === 'practice' ? 'bg-green-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                          
                          {event.description && (
                            <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                          )}
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span>🕐</span>
                              <span>
                                {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                {event.endTime && (
                                  <> - {new Date(event.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
                                )}
                              </span>
                            </div>
                            
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span>📍</span>
                                <span>{event.location}</span>
                              </div>
                            )}
                            
                            {event.livestreamUrl && (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={event.livestreamUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-red-600 text-white text-sm px-3 py-1 font-bold hover:bg-red-700 transition-colors"
                                >
                                  <span>📺</span>
                                  <span>Watch Live</span>
                                </a>
                              </div>
                            )}
                            
                            {event.team && (
                              <div className="flex items-center gap-2">
                                <span className="bg-white text-black text-sm px-3 py-1 font-bold">
                                  {event.team.gender} {event.team.ageGroup}U
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                          🏀
                        </div>
                      </div>
                      
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-all duration-300"
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

      {/* Custom CSS for the calendar */}
      <style jsx global>{`
        .beautiful-calendar {
          background: black;
          border: 1px solid #374151;
          padding: 20px;
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .beautiful-calendar .react-calendar__navigation {
          margin-bottom: 20px;
        }

        .beautiful-calendar .react-calendar__navigation button {
          background: black;
          border: 1px solid #374151;
          color: white;
          font-weight: bold;
          padding: 12px 16px;
          margin: 0 4px;
          transition: all 0.3s ease;
          min-width: 44px;
        }

        .beautiful-calendar .react-calendar__navigation button:hover {
          background: white;
          color: black;
        }

        .beautiful-calendar .react-calendar__navigation button:disabled {
          background: #374151;
          color: #6b7280;
          opacity: 0.5;
        }

        .beautiful-calendar .react-calendar__month-view__weekdays {
          margin-bottom: 10px;
        }

        .beautiful-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 10px 0;
          text-align: center;
          font-weight: bold;
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
          background: black;
          border: 1px solid #374151;
          color: white;
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
          background: white;
          color: black;
        }

        .beautiful-calendar .react-calendar__tile--now {
          background: white;
          color: black;
          font-weight: bold;
        }

        .beautiful-calendar .react-calendar__tile--active,
        .beautiful-calendar .react-calendar__tile--active:enabled:hover,
        .beautiful-calendar .react-calendar__tile--active:enabled:focus {
          background: white;
          color: black;
          font-weight: bold;
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
          background: white;
          border-radius: 50%;
        }

        .beautiful-calendar .react-calendar__tile--neighboringMonth {
          color: #6b7280;
          opacity: 0.5;
        }

        .beautiful-calendar .react-calendar__tile:enabled:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
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