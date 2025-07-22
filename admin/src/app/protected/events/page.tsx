// src/app/protected/events/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Event, Team } from '@/types';
import { getEvents, fetchData } from '@/lib/api';

// Reusable modal for both Add & Edit
function EventFormModal({
  open,
  initial,
  teams,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Partial<Event>;
  teams: Team[];
  onClose: () => void;
  onSave: (e: { 
    title: string; 
    description?: string;
    date: string; 
    startTime: string;
    endTime?: string;
    location?: string;
    type: string;
    livestreamUrl?: string;
    teamId: string 
  }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(
    initial?.date ? initial.date.slice(0, 10) : ''
  );

  const [location, setLocation] = useState(initial?.location ?? '');
  const [type, setType] = useState(initial?.type ?? 'game');
  const [livestreamUrl, setLivestreamUrl] = useState(initial?.livestreamUrl ?? '');
  const [teamId, setTeamId] = useState(
    (initial?.team && 'id' in initial.team ? (initial.team as Team).id : teams[0]?.id) ?? ''
  );

  useEffect(() => {
    if (!open) return

    if (initial) {
      // edit mode
      setTitle(initial.title ?? '')
      setDescription(initial.description ?? '')
      setDate(initial.date?.slice(0, 10) ?? '')
      setLocation(initial.location ?? '')
      setType(initial.type ?? 'game')
      setLivestreamUrl(initial.livestreamUrl ?? '')
      setTeamId(
        (initial.team && 'id' in initial.team
          ? (initial.team as Team).id
          : teams[0]?.id) ?? ''
      )
    } else {
      // add mode
      setTitle('')
      setDescription('')
      setDate('')
      setLocation('')
      setType('game')
      setLivestreamUrl('')
      setTeamId(teams[0]?.id ?? '')
    }
  }, [
    open,      
    initial,   
    teams      
  ])


  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initial ? 'Edit Event' : 'Add Event'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input
              type="text"
              className="mt-1 w-full border px-2 py-1 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full border px-2 py-1 rounded"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date *</label>
            <input
              type="date"
              className="mt-1 w-full border px-2 py-1 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              className="mt-1 w-full border px-2 py-1 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="game">Game</option>
              <option value="practice">Practice</option>
              <option value="tournament">Tournament</option>
              <option value="showcase">Showcase</option>
              <option value="meeting">Meeting</option>
              <option value="training">Training</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Livestream URL</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              className="mt-1 w-full border px-2 py-1 rounded"
              value={livestreamUrl}
              onChange={(e) => setLivestreamUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube, Twitch, or other streaming platform URL
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium">Team *</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.gender.toUpperCase()} — {t.ageGroup}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onSave({ 
              title, 
              description, 
              date, 
              location, 
              type, 
              livestreamUrl, 
              teamId 
            })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL; 

  // load events + teams
  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
    fetchData('teams').then(setTeams).catch(console.error);
  }, []);

  // inside doAdd
  const doAdd = async (e: { 
    title: string; 
    description?: string;
    date: string; 
    startTime: string;
    endTime?: string;
    location?: string;
    type: string;
    livestreamUrl?: string;
    teamId: string 
  }) => {
    const token = localStorage.getItem('adminJwt');
    if (!token) return alert('Not logged in');
    
    // Only send fields that the backend actually expects
    const eventData = {
      title: e.title,
      date: e.date,
      location: e.location,
      type: e.type,
      livestreamUrl: e.livestreamUrl,
      teamId: e.teamId
    };
    
    const res = await fetch(`${API}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      const newEvent = await res.json();
      setEvents((all) => [...all, newEvent]);
      setAdding(false);
    } else {
      const { error } = await res.json();
      alert('Add failed: ' + error);
    }
  };

  // inside doEdit
  const doEdit = async (e: { 
    title: string; 
    description?: string;
    date: string; 
    startTime: string;
    endTime?: string;
    location?: string;
    type: string;
    livestreamUrl?: string;
    teamId: string 
  }) => {
    if (!editing) return;
    const token = localStorage.getItem('adminJwt');
    if (!token) return alert('Not logged in');
    
    // Only send fields that the backend actually expects
    const eventData = {
      title: e.title,
      date: e.date,
      location: e.location,
      type: e.type,
      livestreamUrl: e.livestreamUrl,
      teamId: e.teamId
    };
    
    const res = await fetch(`${API}/api/events/${editing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });
    if (res.ok) {
      const updatedEvent = await res.json();
      setEvents((all) =>
        all.map((ev) => (ev.id === editing.id ? updatedEvent : ev))
      );
      setEditing(null);
    } else {
      const { error } = await res.json();
      alert('Edit failed: ' + error);
    }
  };


  const doDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    const token = localStorage.getItem('adminJwt');
    const res = await fetch(`${API}/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setEvents((all) => all.filter((e) => e.id !== id));
    } else {
      const { error } = await res.json();
      alert('Delete failed: ' + error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setAdding(true)}
        >
          Add Event
        </button>
      </div>

      <ul className="space-y-4">
        {events.map((ev) => (
          <li key={ev.id} className="p-4 bg-white shadow rounded">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-lg">{ev.title}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ev.type === 'tournament' ? 'bg-purple-100 text-purple-800' :
                    ev.type === 'game' ? 'bg-blue-100 text-blue-800' :
                    ev.type === 'practice' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                  </span>
                </div>
                {ev.description && (
                  <p className="text-sm text-gray-600 mb-2">{ev.description}</p>
                )}
                <div className="text-sm text-gray-500 space-y-1">
                  <p>
                    📅 {new Date(ev.date).toLocaleDateString()} 
                    {ev.startTime && (
                      <> • 🕐 {new Date(ev.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
                    )}
                    {ev.endTime && (
                      <> - {new Date(ev.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
                    )}
                  </p>
                  {ev.location && (
                    <p>📍 {ev.location}</p>
                  )}
                  {ev.livestreamUrl && (
                    <p>📺 <a href={ev.livestreamUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Watch Livestream
                    </a></p>
                  )}
                  <p>
                    👥 {ev.team?.gender?.toUpperCase()} {ev.team?.ageGroup}
                  </p>
                </div>
              </div>
              <div className="space-x-2 ml-4">
                <button
                  onClick={() => setEditing(ev)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => doDelete(ev.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {events.length === 0 && (
          <li className="p-4 text-center text-gray-500">No events found.</li>
        )}
      </ul>

      {/* Add Modal */}
      <EventFormModal
        open={adding}
        teams={teams}
        onClose={() => setAdding(false)}
        onSave={doAdd}
      />

      {/* Edit Modal */}
      <EventFormModal
        open={!!editing}
        initial={editing ?? undefined}
        teams={teams}
        onClose={() => setEditing(null)}
        onSave={doEdit}
      />
    </div>
  );
}
