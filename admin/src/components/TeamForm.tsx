'use client';
import { useState } from 'react';

export default function TeamForm({ onCreate }: { onCreate: () => void }) {
  const [gender, setGender] = useState('boys');
  const [ageGroup, setAgeGroup] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gender, ageGroup }),
    });

    if (res.ok) {
      onCreate();
      setAgeGroup('');
    } else {
      alert('Failed to create team');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-2 mb-4">
      <select value={gender} onChange={(e) => setGender(e.target.value)} className="border px-2 py-1">
        <option value="boys">Boys</option>
        <option value="girls">Girls</option>
      </select>
      <input
        placeholder="U13, U14..."
        value={ageGroup}
        onChange={(e) => setAgeGroup(e.target.value)}
        className="border px-2 py-1"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
    </form>
  );
}
