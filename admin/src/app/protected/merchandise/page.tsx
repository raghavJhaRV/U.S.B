// frontend/src/app/protected/merchandise/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Merchandise } from '@/types';
import { fetchMerchandiseData, deleteMerchandise } from '@/lib/api';
import MerchandiseForm from '@/components/MerchandiseForm';
import Image from 'next/image';

export default function MerchandisePage() {
    const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<Merchandise | null>(null);

    const loadMerchandise = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMerchandiseData();
            setMerchandise(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load merchandise.';
            setError(msg);
            console.error('Error loading merchandise:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMerchandise();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this merchandise item?')) {
            setLoading(true);
            setError(null);
            try {
                await deleteMerchandise(id);
                alert('Merchandise deleted successfully!');
                await loadMerchandise();
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Failed to delete merchandise.';
                setError(msg);
                console.error('Error deleting merchandise:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Merchandise Management</h1>

                <MerchandiseForm onSuccess={() => { setEditingItem(null); loadMerchandise(); }} initialData={editingItem} />

                <h2 className="text-xl font-semibold mt-8 mb-4">Existing Merchandise Items</h2>
                {loading && <p>Loading merchandise...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {!loading && merchandise.length === 0 && <p>No merchandise items found.</p>}

                {!loading && merchandise.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Image</th>
                                    <th className="py-2 px-4 border-b">Name</th> {/* Changed from 'Title' to 'Name' */}
                                    <th className="py-2 px-4 border-b">Price</th>
                                    <th className="py-2 px-4 border-b">Stock</th>
                                    <th className="py-2 px-4 border-b">Category</th> {/* Added Category */}
                                    <th className="py-2 px-4 border-b">Active</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {merchandise.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-center">
                                            {item.imageUrl && (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name} // Changed from item.title
                                                    width={80}
                                                    height={80}
                                                    className="object-cover rounded mx-auto"
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">{item.name}</td> {/* Changed from item.title */}
                                        <td className="py-2 px-4 border-b">${item.price.toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b">{item.stock}</td>
                                        <td className="py-2 px-4 border-b">{item.category}</td> {/* Display Category */}
                                        <td className="py-2 px-4 border-b">{item.isActive ? 'Yes' : 'No'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
    );
}