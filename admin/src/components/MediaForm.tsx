// frontend/src/components/MediaForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Media } from '@/types';
import { createMedia, updateMedia, uploadMediaFile } from '@/lib/api'; // Import uploadMediaFile

interface MediaFormProps {
    onSuccess: () => void;
    initialData?: Media | null;
}

export default function MediaForm({ onSuccess, initialData }: MediaFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [url, setUrl] = useState(initialData?.url || '');
    const [file, setFile] = useState<File | null>(null); // State for the selected file
    const [type, setType] = useState(initialData?.type || 'image');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setUrl(initialData.url);
            setType(initialData.type);
            setFile(null); // Clear file input when editing existing item
        } else {
            setTitle('');
            setUrl('');
            setType('image');
            setFile(null);
        }
    }, [initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
            if (!initialData) setUrl('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let mediaUrl = url; // Default to existing URL or manually entered URL

        try {
            // If a new file is selected, upload it first
            if (file) {
                const uploadResponse = await uploadMediaFile(file);
                mediaUrl = uploadResponse.url; // Get the public URL from Supabase
            } else if (!mediaUrl) {
                // If no file and no URL provided
                setError('Please provide either a file to upload or a URL.');
                setLoading(false);
                return;
            }

            const mediaData = {
                title,
                url: mediaUrl,
                type,
            };

            if (initialData) {
                // Update existing media
                await updateMedia(initialData.id, mediaData);
                alert('Media updated successfully!');
            } else {
                // Create new media
                await createMedia(mediaData);
                alert('Media created successfully!');
            }
            onSuccess();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
            console.error('Form submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Media Item' : 'Add New Media Item'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>

            {/* File Upload Input */}
            <div className="mb-4">
                <label htmlFor="file-upload" className="block text-gray-700 text-sm font-bold mb-2">Upload File (Image/Video):</label>
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    accept="image/*,video/*" // Restrict to image and video files
                />
                {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
                {initialData && <p className="mt-2 text-sm text-gray-600">Current URL: <a href={initialData.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{initialData.url}</a></p>}
            </div>

            {/* OR URL Input (for external links or if no file is uploaded) */}
            <div className="mb-4">
                <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">OR provide URL (e.g., YouTube link):</label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg or https://youtube.com/watch?v=..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    // Removed 'required' here, as file upload is an alternative
                />
            </div>

            <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                </select>
            </div>

            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
            >
                {loading ? 'Submitting...' : (initialData ? 'Update Media' : 'Add Media')}
            </button>
            {initialData && (
                <button
                    type="button"
                    onClick={() => onSuccess()}
                    className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    Cancel
                </button>
            )}
        </form>
    );
}