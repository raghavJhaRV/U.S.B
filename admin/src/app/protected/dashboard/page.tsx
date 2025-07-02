// src/app/protected/dashboard/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // remove the token so your guard will kick you back to /login
    localStorage.removeItem('adminToken');
    // optionally clear the cookie too, if you left it in place:
    // document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.replace('/login');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-700">Welcome to the protected admin panel.</p>
      <p className="mt-2">
        Use the sidebar to manage teams, programs, events, and more.
      </p>
    </div>
  );
}
