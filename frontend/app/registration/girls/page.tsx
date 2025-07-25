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
  // Remove waiverFile state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add state for latest waiver URL
  const [latestWaiverUrl, setLatestWaiverUrl] = useState<string | null>(null);

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

    // Fetch latest waiver form
    fetch(`${API_URL}/api/waiver-forms`)
      .then((res) => res.ok ? res.json() : [])
      .then((forms) => {
        if (forms && forms.length > 0) {
          setLatestWaiverUrl(forms[0].url);
        }
      })
      .catch(() => setLatestWaiverUrl(null));
  }, []);


  const filteredGroups = ageGroups.filter(
    (group) => group.gender?.toLowerCase() === gender
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Submit registration
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

      // Step 2: Upload waiver file if provided
      // if (waiverFile && data.id) {
      //   const formData = new FormData();
      //   formData.append('file', waiverFile);
      //   formData.append('registrationId', data.id);

      //   const waiverRes = await fetch(`${API_URL}/api/uploadWaiver`, {
      //     method: "POST",
      //     body: formData,
      //   });

      //   if (!waiverRes.ok) {
      //     console.warn("Waiver upload failed, but registration was successful");
      //   } else {
      //     console.log("Waiver uploaded successfully");
      //   }
      // }

      // Redirect to payment page instead of showing alert
      window.location.href = `/registration/payment/${data.id}`;
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`Registration failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-center uppercase mb-12">
          Girls Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-xl font-bold uppercase">Player Information</h3>
            <input
              type="text"
              placeholder="Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
              required
            />
          </div>

          <div>
            <h3 className="text-xl font-bold uppercase">Parent Information</h3>
            <input
              type="text"
              placeholder="Parent Name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none mt-4"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none mt-4"
              required
            />
          </div>

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

          {/* Waiver Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold uppercase">Waiver & Consent</h3>
            {latestWaiverUrl ? (
              <div className="space-y-4 mt-2">
                <a
                  href={latestWaiverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-300 underline hover:text-blue-100"
                >
                  📄 View Waiver Form
                </a>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    checked={waiverAccepted}
                    onChange={(e) => setWaiverAccepted(e.target.checked)}
                    className="mr-2 mt-1"
                  />
                  <label className="text-sm">
                    I have read and agree to the waiver terms and conditions
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Digital Signature (Type your full name)
                  </label>
                  <input
                    type="text"
                    placeholder="Type your full name as digital signature"
                    value={waiverSignature}
                    onChange={(e) => setWaiverSignature(e.target.value)}
                    className="w-full p-3 border border-white bg-transparent placeholder-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            ) : (
              <p className="text-red-300 mt-4 text-sm">Waiver form not available at the moment.</p>
            )}
          </div>

          <p className="text-sm text-gray-300 mt-4">
            💸 Please send your e-transfer to: <strong>stormbasketball@gmail.com</strong><br />
            Include your player&apos;s name in the message field.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-white text-black font-bold py-3 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </main>
    </div>
  );
}

