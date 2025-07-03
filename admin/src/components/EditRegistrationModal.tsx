// src/components/EditRegistrationModal.tsx
'use client';
import { Registration } from '@/types';
import { useState } from 'react';

interface Props {
  registration: Registration;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Registration) => void;
}

export default function EditRegistrationModal({ registration, open, onClose, onSave }: Props) {
  const [form, setForm] = useState<Registration>({ ...registration });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Registration</h2>
        <div className="space-y-3">
          {(['playerName','parentName','email','phone','waiverUrl'] as (keyof Registration)[]).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                className="mt-1 w-full border px-2 py-1 rounded"
                value={form[field] ?? ''}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
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
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
