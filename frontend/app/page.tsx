"use client";

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="flex items-center justify-center h-[80vh]">
        <h1 className="text-4xl font-bold text-center">United S.T.O.R.M. Basketball</h1>
      </main>
    </div>
  );
}
