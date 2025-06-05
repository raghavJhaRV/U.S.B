"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function TrainingRegisterForm() {
  const { slug } = useParams();
  const [form, setForm] = useState({
    name: "",
    parent: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-6 uppercase">Registration</h1>

      <form className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Player Name"
          className="w-full p-3 bg-black border border-white text-white"
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="parent"
            placeholder="Parent / Guardian Name"
            className="p-3 bg-black border border-white text-white"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="p-3 bg-black border border-white text-white"
            onChange={handleChange}
          />
        </div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 bg-black border border-white text-white"
          onChange={handleChange}
        />

        <div>
          <h2 className="mt-8 text-xl font-bold uppercase mb-2">Program Selection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "Fall Season",
              "Spring Season",
              "Summer Camps",
              "One-on-One Training",
              "Shooting Sessions",
              "Other",
            ].map((option, index) => (
              <button
                type="button"
                key={index}
                className="border border-white py-2 px-4 hover:bg-white hover:text-black transition text-sm"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full border border-white py-2 text-center font-bold hover:bg-white hover:text-black transition"
        >
          Submit
        </button>
      </form>

      <footer className="text-xs text-center mt-10 text-gray-400">
        © 2024 United S.T.O.R.M. Basketball
      </footer>
    </div>
  );
}
