// app/events/[slug]/page.tsx (Updated for complete dummy data alignment)

import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

type DummyEvent = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export default async function EventPage({ params }: Props) {
  const { slug } = await params;

  // Ensure this list contains ALL the 'id' values from your EventsPage component,
  // mapping them to 'slug'.
  const dummyEvents: DummyEvent[] = [
    {
      slug: "event1", // Matches id: "event1" from EventsPage
      title: "Annual Basketball Tournament (Detailed)",
      date: "August 20, 2025",
      description: "Dive deep into the annual basketball tournament details, including teams and schedules.",
    },
    {
      slug: "event2", // Matches id: "event2" from EventsPage
      title: "Summer Soccer Camp (Detailed)", // Updated title
      date: "July 25, 2025",
      description: "An intensive summer camp focused on skill development and teamwork in soccer.",
    },
    {
      slug: "event3", // Matches id: "event3" from EventsPage
      title: "Fall Track & Field Meet (Detailed)", // Updated title
      date: "September 10, 2025",
      description: "A competitive track and field meet featuring various athletic events for all ages.",
    },
    {
      slug: "event4", // Matches id: "event4" from EventsPage
      title: "Winter Hoops Challenge (Detailed)", // Updated title
      date: "December 1, 2025",
      description: "Face off against top teams in this exciting winter basketball challenge.",
    },
    {
      slug: "event5", // Matches id: "event5" from EventsPage
      title: "Spring Marathon (Detailed)", // Updated title
      date: "April 15, 2026",
      description: "Join runners from across the city in our annual spring marathon event.",
    },
    // You can keep other specific slugs if you have direct links to them,
    // but the primary concern is aligning with the EventsPage IDs.
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

  const event = dummyEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

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