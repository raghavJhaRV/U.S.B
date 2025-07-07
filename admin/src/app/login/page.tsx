'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Attempting login with password:', password)
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),      // { password: "…" }
    });

    if (!res.ok) {
      alert('Invalid password');
      return;
    }

    const { token } = await res.json();        // { token: "…" }
    localStorage.setItem('adminJwt', token);    // ← store under "adminJwt"

    document.cookie = `adminJwt=${token}; path=/;`;

    
    router.replace('/protected/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />
          <button
            className="w-full bg-black text-white py-2 rounded"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
