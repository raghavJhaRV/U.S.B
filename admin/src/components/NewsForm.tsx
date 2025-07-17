// frontend/src/components/NewsForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { News } from '@/types'; // Assuming News type

interface NewsFormProps {
    onSuccess: () => void;
    initialData?: News | null;
}

export default function NewsForm({ onSuccess, initialData }: NewsFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setImageUrl(initialData.imageUrl || '');
        } else {
            // Reset form when not in editing mode
            setTitle('');
            setContent('');
            setImageUrl('');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const newsData = { title, content, imageUrl: imageUrl || null }; // Send null if empty string

        try {
            const token = localStorage.getItem('adminJwt');
            if (!token) throw new Error('Admin token not found. Please log in.');

            let res;
            if (initialData) {
                // Update existing news
                res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/${initialData.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(newsData),
                    }
                );
            } else {
                // Create new news
                res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(newsData),
                    }
                );
            }

            if (!res.ok) {
                const { error: apiError } = await res.json();
                throw new Error(apiError || 'An unknown error occurred.');
            }

            onSuccess(); // Callback to parent to refresh list and clear form
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">{initialData ? 'Edit News Item' : 'Create New News Item'}</h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={5}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
            </div>
            <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional):</label>
                <input
                    type="text"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
                {loading ? 'Saving...' : (initialData ? 'Update News' : 'Add News')}
            </button>
            {initialData && (
                <button
                    type="button"
                    onClick={() => { onSuccess(); }} // Just call onSuccess to reset form
                    className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    Cancel Edit
                </button>
            )}
        </form>
    );
}