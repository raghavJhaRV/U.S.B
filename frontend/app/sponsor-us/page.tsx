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

    </div>
  );
}
