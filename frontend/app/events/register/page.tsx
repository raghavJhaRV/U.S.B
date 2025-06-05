"use client";

export default function RegisterTeamPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <img src="/images/logo_U.S.B.jpg" alt="Logo" className="mx-auto mb-6 w-24" />
        <h1 className="text-4xl font-extrabold uppercase mb-4">Registration</h1>

        <form className="space-y-4">
          <input type="text" placeholder="Team Name" className="w-full p-3 bg-black border border-white text-white" />
          <div className="flex gap-4">
            <input type="text" placeholder="Contact Person" className="w-1/2 p-3 bg-black border border-white text-white" />
            <input type="email" placeholder="Email Address" className="w-1/2 p-3 bg-black border border-white text-white" />
          </div>
          <input type="text" placeholder="Phone Number" className="w-full p-3 bg-black border border-white text-white" />

          <h2 className="text-left font-bold text-xl mt-8 mb-2 uppercase">Division Selection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "Boys Under 18", "Boys Under 16", "Boys Under 14",
              "Girls Under 18", "Girls Under 16", "Girls Under 14",
            ].map((label) => (
              <button
                key={label}
                type="button"
                className="border border-white py-2 px-4 hover:bg-white hover:text-black transition"
              >
                {label}
              </button>
            ))}
          </div>

          <button type="submit" className="mt-6 w-full border border-white py-2 px-4 font-bold hover:bg-white hover:text-black transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
