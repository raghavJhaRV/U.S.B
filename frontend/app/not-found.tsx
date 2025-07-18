import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="block bg-white text-black font-bold px-6 py-3 rounded-md hover:bg-gray-200 transition"
          >
            Go Home
          </Link>
          <Link 
            href="/events"
            className="block border border-white text-white font-bold px-6 py-3 rounded-md hover:bg-white hover:text-black transition"
          >
            View Events
          </Link>
        </div>
      </div>
    </div>
  );
} 