'use client';

import { useEffect, useState } from 'react';
import { Program } from '@/types';
import { fetchData } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editing, setEditing] = useState<Program | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    season: '',
    price: '',
  });

  const resetForm = () => setForm({ name: '', description: '', season: '', price: '' });

  const loadPrograms = async () => {
    const data = await fetchData('programs');
    setPrograms(data);
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('adminJwt');
    if (!token) return alert('Not logged in');

    const payload = {
      name: form.name,
      description: form.description,
      season: form.season,
      price: parseFloat(form.price),
    };

    const res = await fetch(
      editing ? `${API}/api/programs/${editing.id}` : `${API}/api/programs`,
      {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      resetForm();
      setAdding(false);
      setEditing(null);
      await loadPrograms();
    } else {
      const { error } = await res.json();
      alert('Save failed: ' + error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    const token = localStorage.getItem('adminJwt');
    const res = await fetch(`${API}/api/programs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPrograms((all) => all.filter((p) => p.id !== id));
    } else {
      const { error } = await res.json();
      alert('Delete failed: ' + error);
    }
  };

  const openEdit = (p: Program) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      season: p.season,
      price: p.price.toString(),
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            setAdding(true);
            resetForm();
            setEditing(null);
          }}
        >
          Add Program
        </button>
      </div>

      <ul className="space-y-4">
        {programs.map((p) => (
          <li key={p.id} className="p-4 bg-white shadow rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-sm text-gray-500">
                  {p.season} – ${p.price.toFixed(2)}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {programs.length === 0 && (
          <li className="text-center text-gray-500">No programs found.</li>
        )}
      </ul>

      {(adding || editing) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editing ? 'Edit Program' : 'Add Program'}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Season"
                className="w-full border px-3 py-2 rounded"
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full border px-3 py-2 rounded"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setAdding(false);
                  setEditing(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
