"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_IMAGE, API_URL } from "../constants";

type NewsItem = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
};

export default function NewsPage() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/news`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch news");
                return res.json();
            })
            .then((data) => {
                console.log("Fetched news from API:", data);
                setNewsItems(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load news:", err);
                setLoading(false);
                setNewsItems([]);
            });
    }, []);

    return (
        <div className="bg-black text-white min-h-screen px-6 py-16">
            <h1 className="text-4xl font-extrabold uppercase text-center mb-12">Latest News</h1>

            {loading ? (
                <div className="text-center text-gray-400">Loading news...</div>
            ) : newsItems.length === 0 ? (
                <div className="text-center text-gray-400">No news articles found.</div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    {newsItems.map((item) => (
                        <div key={item.id} className="text-left">
                            <div className="w-full h-48 bg-neutral-700 mb-4">
                                <img
                                    src={item.imageUrl || DEFAULT_IMAGE}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-gray-300 mb-1">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <h2 className="text-xl font-extrabold uppercase leading-snug">{item.title}</h2>
                            <p className="text-sm text-gray-400 mt-2 mb-4 leading-relaxed">
                                {item.content.substring(0, 100)}...
                            </p>
                            <Link href={`/news/${item.id}`}>
                                <button className="border border-white text-white px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition">
                                    READ MORE
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
