// frontend/src/components/MerchandiseForm.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Merchandise } from '@/types';
import { createMerchandise, updateMerchandise, uploadMediaFile } from '@/lib/api';
import Image from 'next/image'; // ✨ ADD THIS IMPORT STATEMENT ✨

interface MerchandiseFormProps {
    onSuccess: () => void;
    initialData?: Merchandise | null;
}

export default function MerchandiseForm({ onSuccess, initialData }: MerchandiseFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price.toString() || '');
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
    const [stock, setStock] = useState(initialData?.stock.toString() || '0');
    const [category, setCategory] = useState(initialData?.category || ''); // Ensure state is initialized
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true); // Ensure state is initialized
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPrice(initialData.price.toString());
            setImageUrl(initialData.imageUrl);
            setStock(initialData.stock.toString());
            setCategory(initialData.category || ''); // Safely set category, default to empty string
            setIsActive(initialData.isActive ?? true); // Safely set isActive, default to true
            setFile(null);
        } else {
            setName('');
            setDescription('');
            setPrice('');
            setImageUrl('');
            setStock('0');
            setCategory('');
            setIsActive(true);
            setFile(null);
        }
    }, [initialData]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            if (!initialData) {
                // Use URL.createObjectURL for client-side image preview
                setImageUrl(URL.createObjectURL(e.target.files[0]));
            }
        } else {
            setFile(null);
            if (!initialData) setImageUrl('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let finalImageUrl = imageUrl;

        try {
            if (file) {
                const uploadResponse = await uploadMediaFile(file);
                finalImageUrl = uploadResponse.url;
            } else if (!finalImageUrl) {
                setError('Please provide either an image file to upload or an Image URL.');
                setLoading(false);
                return;
            }

            const merchandiseData = {
                name,
                description,
                price: parseFloat(price),
                imageUrl: finalImageUrl,
                stock: parseInt(stock),
                category,
                isActive,
            };

            if (initialData) {
                await updateMerchandise(initialData.id, merchandiseData);
                alert('Merchandise updated successfully!');
            } else {
                await createMerchandise(merchandiseData);
                alert('Merchandise created successfully!');
            }
            onSuccess();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
            console.error('Merchandise form submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Merchandise Item' : 'Add New Merchandise Item'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
            </div>

            <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" step="0.01" required />
            </div>

            {/* File Upload Input */}
            <div className="mb-4">
                <label htmlFor="file-upload" className="block text-gray-700 text-sm font-bold mb-2">Upload Image:</label>
                <input type="file" id="file-upload" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" accept="image/*" />
                {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
                {initialData && initialData.imageUrl && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Current Image:</p>
                        <a href={initialData.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{initialData.imageUrl}</a>
                        {/* Ensure Image component is correctly imported and used */}
                        <Image src={initialData.imageUrl} alt="Current Merchandise Image" width={100} height={100} className="mt-2 rounded object-cover" />
                    </div>
                )}
                {/* Display temporary image URL if a file is selected for a new item */}
                {!initialData && file && imageUrl && (
                     <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected Image Preview:</p>
                        {/* Ensure Image component is correctly imported and used */}
                        <Image src={imageUrl} alt="New Merchandise Preview" width={100} height={100} className="mt-2 rounded object-cover" />
                    </div>
                )}
            </div>

            {/* OR URL Input */}
            <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">OR provide Image URL:</label>
                <input type="url" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/product.jpg" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
                <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">Stock:</label>
                <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
            </div>

            <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4 flex items-center">
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="mr-2 leading-tight" />
                <label htmlFor="isActive" className="text-gray-700 text-sm font-bold">Active Item</label>
            </div>

            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading}>
                {loading ? 'Submitting...' : (initialData ? 'Update Merchandise' : 'Add Merchandise')}
            </button>
            {initialData && (
                <button type="button" onClick={() => onSuccess()} className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={loading}>
                    Cancel
                </button>
            )}
        </form>
    );
}