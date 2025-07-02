'use client';

import { useEffect, useState } from 'react';
import { Team } from '@/types';
import { getTeams } from '@/lib/api';
import TeamForm from '@/components/TeamForm';

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);

    // fetch the list on mount
    useEffect(() => {
        getTeams()
            .then(setTeams)
            .catch(console.error);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Teams</h1>

            {/* Create new team */}
            <TeamForm
                onCreate={async () => {
                    // re-load after you add
                    const updated = await getTeams();
                    setTeams(updated);
                }}
            />

            {/* List existing teams */}
            <ul className="mt-6 space-y-3">
                {teams.map((team) => (
                    <li
                        key={team.id}
                        className="flex justify-between items-center p-4 bg-white rounded shadow"
                    >
                        <span>
                            <strong>{team.gender.toUpperCase()}</strong> — {team.ageGroup}
                        </span>

                        <div className="space-x-2">
                            <button
                                className="text-blue-500 hover:underline"
                                onClick={async () => {
                                    const newAge = prompt('New age group:', team.ageGroup);
                                    if (!newAge) return;

                                    try {
                                        // ① Grab the JWT you stored on login
                                        const token = localStorage.getItem('adminJwt');

                                        // ② Send it in the Authorization header
                                        const res = await fetch(
                                            `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${team.id}`,
                                            {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({ gender: team.gender, ageGroup: newAge }),
                                            }
                                        );

                                        // ③ Handle errors
                                        if (!res.ok) {
                                            const { error } = await res.json();
                                            throw new Error(error);
                                        }

                                        // ④ Refresh the list
                                        setTeams(await getTeams());
                                    } catch (err: unknown) {
                                        const msg = err instanceof Error ? err.message : String(err);
                                        alert('Update failed: ' + msg);
                                    }
                                }}
                            >
                                Edit
                            </button>

                            <button
                                className="text-red-500 hover:underline"
                                onClick={async () => {
                                    if (!confirm('Delete this team?')) return;

                                    try {
                                        const token = localStorage.getItem('adminJwt');
                                        const res = await fetch(
                                            `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${team.id}`,
                                            {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                            }
                                        );

                                        if (!res.ok) {
                                            // parse the JSON { error: "..." }
                                            const { error } = await res.json();
                                            throw new Error(error);
                                        }

                                        // refresh on success
                                        setTeams(await getTeams());
                                    } catch (err: unknown) {
                                        const msg = err instanceof Error ? err.message : String(err);
                                        alert(msg);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
