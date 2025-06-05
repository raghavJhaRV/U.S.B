"use client";

import { useParams } from "next/navigation";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function RegistrationPage() {
  const { category } = useParams(); // "girls" or "boys"

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase">Registration</h1>
        <h3 className="text-2xl font-bold text-center mt-2 uppercase">Girls</h3>
        <h2 className="text-2xl font-bold text-center mt-2 uppercase">{category}</h2>

        <form className="mt-10 space-y-6">
          <input
            type="text"
            placeholder="Player Name"
            className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Parent / Guardian Name"
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
          />

          <div className="mt-8">
            <h3 className="text-xl font-bold uppercase">Program Selection</h3>
            <p className="mt-1 mb-4">Select a team</p>
            <div className="grid grid-cols-4 gap-4">
              {["U11", "U13", "U15", "U16", "U18"].map((team) => (
                <button
                  key={team}
                  type="button"
                  className="border border-white py-2 px-4 hover:bg-white hover:text-black transition"
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-white text-black font-bold py-3 hover:bg-gray-200 transition"
          >
            Submit
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
