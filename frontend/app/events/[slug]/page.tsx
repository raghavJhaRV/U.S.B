// app/events/[slug]/page.tsx

import { notFound } from "next/navigation"; // Import notFound for 404 handling

// Define the types for the component's props
type Props = {
  params: {
    slug: string; // The dynamic segment from the URL, e.g., 'tech-conference-2025'
  };
  // >>> THIS LINE IS THE CRITICAL FIX <<<
  // searchParams is included for full PageProps compatibility in Next.js async components.
  // The absence of this property is causing the Type 'Props' does not satisfy the constraint 'PageProps' error.
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Define the type for an individual event object in the dummy data
type DummyEvent = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

// EventPage is an asynchronous Server Component that fetches and displays event details
export default async function EventPage({ params }: Props) {
  // Await the 'params' object to ensure it's fully resolved before access.
  // This prevents the "params should be awaited" runtime error.
  const { slug } = await params;

  // --- Dummy Data (Simulating a database or API response) ---
  const dummyEvents: DummyEvent[] = [
    {
      slug: "event1",
      title: "Annual Basketball Tournament (Detailed)",
      date: "August 20, 2025",
      description: "Dive deep into the annual basketball tournament details, including teams and schedules.",
    },
    {
      slug: "event2",
      title: "Summer Soccer Camp (Detailed)",
      date: "July 25, 2025",
      description: "An intensive summer camp focused on skill development and teamwork in soccer.",
    },
    {
      slug: "event3",
      title: "Fall Track & Field Meet (Detailed)",
      date: "September 10, 2025",
      description: "A competitive track and field meet featuring various athletic events for all ages.",
    },
    {
      slug: "event4",
      title: "Winter Hoops Challenge (Detailed)",
      date: "December 1, 2025",
      description: "Face off against top teams in this exciting winter basketball challenge.",
    },
    {
      slug: "event5",
      title: "Spring Marathon (Detailed)",
      date: "April 15, 2026",
      description: "Join runners from across the city in our annual spring marathon event.",
    },
    {
      slug: "tech-conference-2025",
      title: "Annual Tech Conference 2025",
      date: "October 26, 2025",
      description: "A comprehensive gathering of tech enthusiasts and industry leaders from around the globe.",
    },
    {
      slug: "community-clean-up-day",
      title: "Community Clean-up Day",
      date: "September 15, 2025",
      description: "Join us in making our neighborhood sparkle! A day dedicated to environmental stewardship.",
    },
    {
      slug: "summer-music-festival",
      title: "Summer Music Festival",
      date: "August 10, 2025",
      description: "Experience vibrant live music performances from various artists, coupled with delicious local food vendors.",
    },
  ];

  // Attempt to find the event that matches the 'slug' from the URL.
  const event = dummyEvents.find((e) => e.slug === slug);

  // If no event is found for the given slug, trigger Next.js's notFound()
  if (!event) {
    notFound();
  }

  // --- Render the Event Details ---
  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-400">{event.title}</h1>
      <p className="text-xl text-center text-gray-300 mb-8">
        Date: {new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="text-lg leading-relaxed text-gray-200 text-center max-w-2xl mx-auto">
        {event.description}
      </p>
    </div>
  );
}