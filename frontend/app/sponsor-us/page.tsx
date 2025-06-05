"use client";

export default function SponsorUsPage() {
  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center uppercase mb-12">Sponsor Us</h1>

      {/* Form */}
      <form className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="SPONSOR NAME"
          className="w-full px-4 py-2 bg-black border border-white rounded uppercase placeholder-white"
        />
        <input
          type="text"
          placeholder="CONTACT NAME"
          className="w-full px-4 py-2 bg-black border border-white rounded uppercase placeholder-white"
        />
        <input
          type="email"
          placeholder="EMAIL ADDRESS"
          className="w-full px-4 py-2 bg-black border border-white rounded uppercase placeholder-white"
        />
        <input
          type="tel"
          placeholder="PHONE NUMBER"
          className="w-full px-4 py-2 bg-black border border-white rounded uppercase placeholder-white"
        />
        <label className="block font-bold uppercase mt-6">Message</label>
        <textarea
          rows={4}
          placeholder=""
          className="w-full px-4 py-2 bg-black border border-white rounded text-white"
        />
        <button
          type="submit"
          className="w-full border border-white px-4 py-2 font-bold uppercase rounded hover:bg-white hover:text-black transition"
        >
          Submit
        </button>
      </form>

      {/* Footer-style section */}
      <footer className="mt-20 bg-[#111] py-12 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* About */}
          <div>
            <h3 className="font-bold uppercase mb-4">About</h3>
            <ul className="space-y-1">
              <li><a href="/about">About</a></li>
              <li><a href="/news">News</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-bold uppercase mb-4">Programs</h3>
            <ul className="space-y-1">
              <li><a href="/sponsorship">Sponsorship</a></li>
              <li><a href="/teams">Teams</a></li>
              <li><a href="/schedule">Schedule</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold uppercase mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#"><span className="text-xl">📸</span></a>
              <a href="#"><span className="text-xl">📘</span></a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-center mt-12 text-xs text-gray-400">
          © 2024 United S.T.O.R.M. Basketball
        </p>
      </footer>
    </div>
  );
}
