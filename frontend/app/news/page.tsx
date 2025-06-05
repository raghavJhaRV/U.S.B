"use client";

import Link from "next/link";
import { DEFAULT_IMAGE } from "../constants";

export default function NewsPage() {
    const newsItems = [
        {
            date: "April 20, 2024",
            title: "Lorem Ipsum Dolor Sit Amet",
            desc:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        },
        {
            date: "April 20, 2024",
            title: "Lorem Ipsum Dolor Sit Amet",
            desc:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        },
        {
            date: "April 20, 2024",
            title: "Lorem Ipsum Dolor Sit Amet",
            desc:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        },
    ];

    return (
        <div className="bg-black text-white min-h-screen px-6 py-16">
            <h1 className="text-4xl font-extrabold uppercase text-center mb-12">Latest News</h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {newsItems.map((item, index) => (
                    <div key={index} className="text-left">
                        <div className="w-full h-48 bg-neutral-700 mb-4">
                            <img
                                src={DEFAULT_IMAGE}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-xs text-gray-300 mb-1">{item.date}</p>
                        <h2 className="text-xl font-extrabold uppercase leading-snug">{item.title}</h2>
                        <p className="text-sm text-gray-400 mt-2 mb-4 leading-relaxed">{item.desc}</p>
                        <Link href={`/news/lorem-ipsum`}>
                            <button className="border border-white text-white px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition">
                                READ MORE
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
