"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "../../constants";

type Event = {
  id: string;
  title: string;
  date: string;
  teamId: string;
  team: {
    id: string;
    gender: string;
    ageGroup: string;
  };
};

export default function EventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        
        // Find the event by ID (using slug as ID for now)
        const foundEvent = events.find((e: Event) => e.id === slug);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded mb-4"></div>
            <div className="h-6 bg-gray-800 rounded mb-8"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-red-400 mb-4">Event Not Found</h1>
          <p className="text-gray-300 mb-8">
            {error || "The event you're looking for doesn't exist."}
          </p>
          <a 
            href="/events" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Back to Events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-4">
            {event.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-lg text-gray-300">
            <span>
              📅 {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>
              🏀 {event.team.gender} {event.team.ageGroup}U
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Event Details</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Event Information</h3>
              <div className="space-y-3 text-gray-200">
                <div>
                  <span className="font-medium">Title:</span> {event.title}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {new Date(event.date).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Team Information</h3>
              <div className="space-y-3 text-gray-200">
                <div>
                  <span className="font-medium">Gender:</span> {event.team.gender}
                </div>
                <div>
                  <span className="font-medium">Age Group:</span> {event.team.ageGroup}U
                </div>
                <div>
                  <span className="font-medium">Team ID:</span> {event.team.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Section */}
        <div className="bg-blue-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Join This Event</h2>
          <p className="text-blue-100 mb-6">
            Ready to participate? Register now to secure your spot in this exciting event!
          </p>
          <a 
            href="/events/register" 
            className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Register Now
          </a>
        </div>

        {/* Back to Events */}
        <div className="text-center">
          <a 
            href="/events" 
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition"
          >
            ← Back to All Events
          </a>
        </div>
      </div>
    </div>
  );
}