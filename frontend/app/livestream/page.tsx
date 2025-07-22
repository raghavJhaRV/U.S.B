'use client';

import { useEffect, useState } from 'react';
import { Event } from '../../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LivestreamPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        // Filter events that have livestream URLs
        const eventsWithLivestreams = data.filter((event: Event) => 
          event.livestreamUrl && event.livestreamUrl.trim() !== ''
        );
        
        setEvents(eventsWithLivestreams);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load livestreams');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from YouTube URL
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const getTwitchEmbedUrl = (url: string) => {
    // Extract channel from Twitch URL
    const channelMatch = url.match(/twitch\.tv\/([^\/\s]+)/);
    if (channelMatch) {
      return `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${window.location.hostname}`;
    }
    return url;
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url);
    } else if (url.includes('twitch.tv')) {
      return getTwitchEmbedUrl(url);
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading livestreams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Livestreams</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Streams</h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-gray-500 text-6xl mb-4">📺</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Live Streams Available</h2>
              <p className="text-gray-600 mb-6">
                There are currently no live streams scheduled. Check back later for upcoming games and events!
              </p>
              <a 
                href="/events" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                View All Events
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Streams</h1>
          <p className="text-xl text-gray-600">
            Watch our teams compete live! Tune in to catch all the action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={getEmbedUrl(event.livestreamUrl!)}
                  title={`Live Stream - ${event.title}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  {event.date && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </span>
                  )}
                  {event.location && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      📍 {event.location}
                    </span>
                  )}
                  {event.type && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      🏀 {event.type}
                    </span>
                  )}
                  {event.team && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      👥 {event.team.gender} {event.team.ageGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="/events" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Events
          </a>
        </div>
      </div>
    </div>
  );
} 