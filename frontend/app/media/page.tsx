"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay as faPlaySolid, faImage as faImageSolid } from '@fortawesome/free-solid-svg-icons'
import { API_URL } from "../constants";

type MediaItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  createdAt: string;
};

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/media`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setMediaItems(data);
        } else {
          setError('Invalid data format received from server');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load media:", err);
        setError(err.message);
        setLoading(false);
        setMediaItems([]);
      });
  }, []);

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderMediaItem = (item: MediaItem) => {
    if (item.type === 'video') {
      const videoId = getYouTubeVideoId(item.url);
      if (videoId) {
        return (
          <div className="relative group cursor-pointer">
            <div className="w-full h-64 overflow-hidden relative bg-gray-800">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={item.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="absolute bottom-4 left-4 text-left">
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faPlaySolid} className="text-green-400 text-sm" />
                <p className="text-xs text-white font-medium uppercase">Video</p>
              </div>
              <h3 className="text-lg font-bold uppercase leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
        );
      } else {
        // Fallback for non-YouTube videos
        return (
          <div className="relative group cursor-pointer">
            <div className="w-full h-64 overflow-hidden relative bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faPlaySolid} className="text-green-400 text-4xl mb-2" />
                <p className="text-white text-sm">Video</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-left">
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faPlaySolid} className="text-green-400 text-sm" />
                <p className="text-xs text-white font-medium uppercase">Video</p>
              </div>
              <h3 className="text-lg font-bold uppercase leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
        );
      }
    } else {
      // Image type
      return (
        <div className="relative group cursor-pointer">
          <div className="w-full h-64 overflow-hidden relative bg-gray-800">
            <Image
              src={item.url}
              alt={item.title}
              width={400}
              height={256}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized={true} // Disable Next.js image optimization for external URLs
              onError={(e) => {
                // Fallback for broken images
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                      <div class="text-center">
                        <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-white text-sm">Image</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
          <div className="absolute bottom-4 left-4 text-left">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faImageSolid} className="text-green-400 text-sm" />
              <p className="text-xs text-white font-medium uppercase">Image</p>
            </div>
            <h3 className="text-lg font-bold uppercase leading-tight">
              {item.title}
            </h3>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-6">Media</h1>

        {loading ? (
          <div className="text-center text-gray-400">Loading media...</div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p className="mb-2">Error: {error}</p>
            <p className="text-sm">Please try refreshing the page or contact support.</p>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center text-gray-400">
            <p className="mb-4">No media available.</p>
            <p className="text-sm">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mediaItems.map((item) => (
              <div key={item.id}>
                {renderMediaItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
