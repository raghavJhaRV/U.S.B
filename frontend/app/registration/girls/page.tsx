"use client";

import { useState, useEffect } from "react";
import { API_URL } from "../../constants";

type Program = {
  id: string;
  name: string;
};

type Team = {
  id: string;
  gender: string;
  ageGroup: string;
};

export default function RegistrationPage() {
  // 👧 Hardcoded gender for this page
  const gender = "girls";

  const [playerName, setPlayerName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [waiverSignature, setWaiverSignature] = useState("");


  const [programs, setPrograms] = useState<Program[]>([]);
  const [ageGroups, setAgeGroups] = useState<Team[]>([]);

  const [programId, setProgramId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/programs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch programs");
        return res.json();
      })
      .then(setPrograms)
      .catch((err) => console.error("Failed to load programs:", err));

    fetch(`${API_URL}/api/teams`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch teams");
        return res.json();
      })
      .then((data) => {

        setAgeGroups(data);
      })
      .catch((err) => console.error("Failed to load age groups:", err));
  }, []);


  const filteredGroups = ageGroups.filter(
    (group) => group.gender?.toLowerCase() === gender
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName,
          parentName,
          email,
          phone,
          waiverAccepted,
          waiverSignature,
          teamId: selectedTeam,
          programId,
          eTransferNote: `Registration for ${playerName}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Registration failed");

      alert("Registration successful!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase">Registration</h1>
        <h3 className="text-2xl font-bold text-center mt-2 uppercase">Girls Program</h3>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Parent / Guardian Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
          />

          {/* Filtered Age Groups */}
          <div className="mt-8">
            <h3 className="text-xl font-bold uppercase">Age Group</h3>
            <p className="mt-1 mb-4">Select an age group</p>
            <div className="grid grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={`border py-2 px-4 ${selectedTeam === group.id ? "bg-white text-black" : "bg-transparent"
                    }`}
                  onClick={() => setSelectedTeam(group.id)}
                >
                  {group.ageGroup}
                </button>
              ))}
            </div>
            {filteredGroups.length === 0 && (
              <p className="text-sm italic text-red-400 mt-3">
                No age groups available for girls yet.
              </p>
            )}
          </div>

          {/* Program Selection */}
          <div className="mt-8">
            <h3 className="text-xl font-bold uppercase">Program Type</h3>
            <p className="mt-1 mb-4">Choose a training program</p>
            <div className="grid grid-cols-3 gap-4">
              {programs.map((program) => (
                <button
                  key={program.id}
                  type="button"
                  className={`border py-2 px-4 ${programId === program.id ? "bg-white text-black" : "bg-transparent"
                    }`}
                  onClick={() => setProgramId(program.id)}
                >
                  {program.name}
                </button>
              ))}
            </div>
          </div>

          <input
            type="checkbox"
            required
            checked={waiverAccepted}
            onChange={(e) => setWaiverAccepted(e.target.checked)}
            className="mr-2"
          />
          <label>I have read and agree to the <a href="/waiver.pdf" target="_blank" className="underline">waiver</a></label>

          <input
            type="text"
            placeholder="Type your full name as digital signature"
            value={waiverSignature}
            onChange={(e) => setWaiverSignature(e.target.value)}
            className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
            required
          />

          <p className="text-sm text-gray-300 mt-4">
            💸 Please send your e-transfer to: <strong>stormbasketball@gmail.com</strong><br />
            Include your player&apos;s name in the message field.
          </p>


          <button
            type="submit"
            className="w-full mt-6 bg-white text-black font-bold py-3 hover:bg-gray-200 transition"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}

