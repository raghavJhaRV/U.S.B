"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "../../constants";

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const articles = await response.json();
        
        // Find the article by ID (using slug as ID for now)
        const foundArticle = articles.find((a: NewsArticle) => a.id === slug);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-800 rounded mb-4"></div>
            <div className="h-12 bg-gray-800 rounded mb-6"></div>
            <div className="h-96 bg-gray-800 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-black text-white min-h-screen px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-red-400 mb-4">Article Not Found</h1>
          <p className="text-gray-300 mb-8">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <Link
            href="/news"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Article Header */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-300 mb-2">
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
            <span>📰 USB News</span>
            <span>•</span>
            <span>
              {article.updatedAt !== article.createdAt 
                ? `Updated ${new Date(article.updatedAt).toLocaleDateString()}`
                : "Published"
              }
            </span>
          </div>
        </div>

        {/* Article Image */}
        {article.imageUrl && (
          <div className="relative w-full h-64 sm:h-96 bg-neutral-700 mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                      <div class="text-center">
                        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-white">Image Not Available</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none">
          <div className="text-lg text-gray-200 leading-relaxed space-y-6">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-left">
                {paragraph || '\u00A0'} {/* Use non-breaking space for empty paragraphs */}
              </p>
            ))}
          </div>
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-400">
              <p>Article ID: {article.id}</p>
              <p>Published: {new Date(article.createdAt).toLocaleString()}</p>
            </div>
            
            <div className="flex gap-4">
              <button className="text-sm font-semibold border border-white px-4 py-2 hover:bg-white hover:text-black transition">
                Share Article
              </button>
              <Link
                href="/news"
                className="text-sm font-semibold border border-white px-4 py-2 hover:bg-white hover:text-black transition"
              >
                Back to News
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">More News</h2>
          <div className="bg-gray-900 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              Stay updated with the latest news and announcements from USB.
            </p>
            <Link
              href="/news"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
            >
              View All News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
