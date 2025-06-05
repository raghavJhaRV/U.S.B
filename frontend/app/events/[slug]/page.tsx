import { notFound } from "next/navigation";
import Link from "next/link";

const events = {
  "spring-showdown": "Spring Showdown",
  "fall-classic": "Fall Classic",
  "winter-invitational": "Winter Invitational",
};

export default function EventBracketPage({ params }: { params: { slug: string } }) {
  const eventName = events[params.slug as keyof typeof events];
  if (!eventName) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold uppercase text-center mb-6">{eventName}</h1>

      <div className="text-center mb-6">
        <Link
          href="/events/register"
          className="border border-white py-2 px-4 mt-4 inline-block hover:bg-white hover:text-black transition"
        >REGISTER YOUR TEAM</Link>
      </div>

      {/* Boys Section */}
      <section className="mb-10">
        <h2 className="text-lg font-bold">BOYS</h2>
        <div className="flex gap-2 mt-2 mb-4">
          {["U11", "U13", "U15", "U16", "U18"].map((age) => (
            <button key={age} className="px-4 py-1 border rounded">{age}</button>
          ))}
        </div>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <tbody>
            {["U11", "U13", "U15"].map((team) => (
              <tr key={team}>
                <td className="py-2">9:00 AM</td>
                <td>{team}</td>
                <td className="text-right">
                  <button className="border px-4 py-1 rounded hover:bg-white hover:text-black transition">
                    Bracket
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Girls Section */}
      <section>
        <h2 className="text-lg font-bold">GIRLS</h2>
        <div className="flex gap-2 mt-2 mb-4">
          {["U11", "U13", "U15", "U16", "U18"].map((age) => (
            <button key={age} className="px-4 py-1 border rounded">{age}</button>
          ))}
        </div>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <tbody>
            {["U11", "U13", "U15"].map((team) => (
              <tr key={team}>
                <td className="py-2">9:00 AM</td>
                <td>{team}</td>
                <td className="text-right">
                  <button className="border px-4 py-1 rounded hover:bg-white hover:text-black transition">
                    Bracket
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
