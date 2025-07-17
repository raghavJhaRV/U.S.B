// app/events/[slug]/page.tsx

import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
  // Still include searchParams for PageProps compatibility with async components
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function EventPage({ params }: Props) {
  const { slug } = params;

  // Simulate fetching data with dummy data
  // In a real application, you might have a more complex
  // dummy data structure or even a local JSON file.
  const dummyEvents = [
    {
      slug: "tech-conference-2025",
      title: "Annual Tech Conference 2025",
      date: "October 26, 2025",
      description: "A gathering of tech enthusiasts and industry leaders.",
    },
    {
      slug: "community-clean-up-day",
      title: "Community Clean-up Day",
      date: "September 15, 2025",
      description: "Join us to make our neighborhood sparkle!",
    },
    {
      slug: "summer-music-festival",
      title: "Summer Music Festival",
      date: "August 10, 2025",
      description: "Enjoy live music and local food vendors.",
    },
  ];

  // Find the event that matches the slug
  const event = dummyEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound(); // Still use notFound if the slug doesn't match a dummy event
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.date}</p>
      <p>{event.description}</p>
    </div>
  );
}