// app/events/[slug]/page.tsx

import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
  // Add searchParams to align with Next.js PageProps type
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function EventPage({ params }: Props) {
  const { slug } = params;

  const res = await fetch(`https://usb-backend.onrender.com/api/events/${slug}`);
  const event = await res.json();

  if (!event) {
    notFound();
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.date}</p>
    </div>
  );
}