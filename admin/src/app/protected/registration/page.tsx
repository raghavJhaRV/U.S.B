// src/app/protected/registration/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Registration } from '@/types';
import { fetchData } from '@/lib/api';
import EditRegistrationModal from '@/components/EditRegistrationModal';

export default function RegistrationPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selected, setSelected] = useState<Registration|null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchData('registrations')
      .then(setRegistrations)
      .catch(console.error);
  }, []);

  // filter registrations by query
  const filtered = registrations.filter((r) => {
    const q = query.toLowerCase();
    return (
      r.playerName.toLowerCase().includes(q) ||
      (r.parentName?.toLowerCase().includes(q) ?? false) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone?.toLowerCase().includes(q) ?? false)
    );
  });

  const handleSave = async (updated: Registration) => {
    const token = localStorage.getItem('adminJwt');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${updated.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      }
    );
    if (res.ok) {
      setRegistrations((all) =>
        all.map((r) => (r.id === updated.id ? updated : r))
      );
      setSelected(null);
    } else {
      const { error } = await res.json();
      alert('Save failed: ' + error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Registrations</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by player, parent, email or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2">Parent</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Waiver</th>
              <th className="px-4 py-2">Program</th>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg) => (
              <tr key={reg.id} className="border-t">
                <td className="px-4 py-2">{reg.playerName}</td>
                <td className="px-4 py-2">{reg.parentName}</td>
                <td className="px-4 py-2">{reg.email}</td>
                <td className="px-4 py-2">{reg.phone}</td>
                <td className="px-4 py-2">
                  {reg.waiverUrl ? (
                    <a
                      href={reg.waiverUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600"
                    >
                      View
                    </a>
                  ) : (
                    'No'
                  )}
                </td>
                <td className="px-4 py-2">{reg.programName}</td>
                <td className="px-4 py-2">{reg.teamLabel}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setSelected(reg)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={async () => {
                      if (!confirm('Delete this registration?')) return;
                      const token = localStorage.getItem('adminJwt');
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${reg.id}`,
                        {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      if (res.ok) {
                        setRegistrations((all) =>
                          all.filter((r) => r.id !== reg.id)
                        );
                      } else {
                        const { error } = await res.json();
                        alert('Delete failed: ' + error);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pop-up modal */}
      {selected && (
        <EditRegistrationModal
          open={true}
          registration={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
