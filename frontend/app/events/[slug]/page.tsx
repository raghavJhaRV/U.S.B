"use client";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div>
      <h1>Event Details for {slug}</h1>
    </div>
  );
}
