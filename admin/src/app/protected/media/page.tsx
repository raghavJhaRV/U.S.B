// frontend/src/app/protected/media/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { Media } from '@/types';
// Ensure these functions are correctly imported from '@/lib/api'
import { getMedia, deleteMedia } from '@/lib/api';
import MediaForm from '../../../components/MediaForm'; // Correct path assumed

export default function MediaPage() {
    const [mediaList, setMediaList] = useState<Media[]>([]);
    const [editingMedia, setEditingMedia] = useState<Media | null>(null);

    const fetchMedia = async () => {
        try {
            const response = await getMedia();
            setMediaList(response);
        } catch (error) {
            console.error('Error fetching media:', error);
            alert('Failed to fetch media. See console for details.');
        }
    };

    const handleFormSuccess = () => {
        setEditingMedia(null); // Clear editing state
        fetchMedia(); // Re-fetch data
    };

    const handleEdit = (mediaItem: Media) => {
        setEditingMedia(mediaItem);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this media item?')) return;

        try {
            await deleteMedia(id);
            alert('Media item deleted successfully!');
            fetchMedia();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert('Delete failed: ' + msg);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Media Management</h1>

            <MediaForm
                onSuccess={handleFormSuccess}
                initialData={editingMedia}
            />

            <hr className="my-6" />

            <h3 className="text-xl font-semibold mb-3">Existing Media Items</h3>
            {mediaList.length === 0 ? (
                <p>No media items found.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediaList.map((mediaItem) => (
                        <li key={mediaItem.id} className="p-4 bg-white rounded shadow">
                            <h4 className="font-bold text-lg mb-2">{mediaItem.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">Type: {mediaItem.type}</p>
                            {mediaItem.type === 'image' && mediaItem.url && (
                                <div className="relative w-full h-48 mb-2 overflow-hidden rounded">
                                    <Image
                                        src={mediaItem.url}
                                        alt={mediaItem.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            {/* CORRECTED: Removed redundant outer check for video */}
                            {mediaItem.type === 'video' && mediaItem.url && (
                                <div className="relative w-full h-48 mb-2">
                                    <iframe
                                        className="w-full h-full rounded"
                                        // More robust YouTube URL transformation
                                        src={
                                            mediaItem.url.includes('youtube.com/watch?v=')
                                                ? mediaItem.url.replace('watch?v=', 'embed/')
                                                : mediaItem.url // Use as-is if it's not a watch URL (assuming it's already an embed or valid video URL)
                                        }
                                        title={mediaItem.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            <p className="text-sm text-gray-500 truncate">URL: <a href={mediaItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{mediaItem.url}</a></p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(mediaItem.createdAt).toLocaleDateString()}
                            </p>
                            <div className="mt-3 space-x-2">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => handleEdit(mediaItem)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(mediaItem.id)}
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