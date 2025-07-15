// app/events/[slug]/page.tsx
import { notFound } from "next/navigation";

// Define the interface for your page component's props
// This explicitly tells TypeScript what `params` should look like
interface EventDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) { // Use your defined interface here
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?slug=${params.slug}`);
  if (!res.ok) return notFound();

  const event = await res.json();

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <img
          src={event.image || "/images/media1.jpg"}
          alt={event.title}
          className="mx-auto mb-6 w-24"
        />
        <h1 className="text-4xl font-extrabold uppercase mb-2">{event.title}</h1>
        <p className="text-gray-400 mb-6">
          {new Date(event.date).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}