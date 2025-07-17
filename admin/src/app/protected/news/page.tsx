// frontend/src/app/protected/news/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { News } from '@/types'; // Assuming you have a News type defined in types/index.ts
import { getNews } from '@/lib/api'; // We'll create this helper
import NewsForm from '../../../components/NewsForm';  

export default function NewsPage() {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [editingNews, setEditingNews] = useState<News | null>(null);

    // Function to fetch news
    const fetchNews = async () => {
        try {
            // Using the public endpoint for display, admin edits via specific routes
            const response = await getNews();
            setNewsList(response);
        } catch (error) {
            console.error('Error fetching news:', error);
            alert('Failed to fetch news. See console for details.');
        }
    };

    // Handler for successful form submission (create or update)
    const handleFormSuccess = () => {
        setEditingNews(null); // Clear editing state
        fetchNews(); // Refresh the list
    };

    // Handler for editing a news item
    const handleEdit = (newsItem: News) => {
        setEditingNews(newsItem);
    };

    // Handler for deleting a news item
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this news item?')) return;

        try {
            const token = localStorage.getItem('adminJwt');
            if (!token) throw new Error('Admin token not found.');

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error);
            }

            alert('News deleted successfully!');
            fetchNews(); // Refresh the list
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert('Delete failed: ' + msg);
        }
    };

    // Fetch news on component mount
    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">News Management</h1>

            {/* News Creation/Edit Form */}
            <NewsForm
                onSuccess={handleFormSuccess}
                initialData={editingNews}
            />

            <hr className="my-6" />

            {/* List Existing News */}
            <h3 className="text-xl font-semibold mb-3">Existing News Items</h3>
            {newsList.length === 0 ? (
                <p>No news items found.</p>
            ) : (
                <ul className="space-y-4">
                    {newsList.map((newsItem) => (
                        <li key={newsItem.id} className="p-4 bg-white rounded shadow">
                            <h4 className="font-bold text-lg">{newsItem.title}</h4>
                            <p className="text-gray-700 mt-1">{newsItem.content}</p>
                            {newsItem.imageUrl && (
                                <img src={newsItem.imageUrl} alt={newsItem.title} className="mt-2 max-w-xs h-auto" />
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Created: {new Date(newsItem.createdAt).toLocaleDateString()}
                            </p>
                            <div className="mt-3 space-x-2">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => handleEdit(newsItem)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(newsItem.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}