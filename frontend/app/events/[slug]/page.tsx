// app/events/[slug]/page.tsx
import { notFound } from "next/navigation";

// app/events/[slug]/page.tsx

type Props = {
  params: {
    slug: string;
  };
};

export default async function EventPage({ params }: Props) {
  const { slug } = params;

  return (
    <div>
      <h1>Event Details for {slug}</h1>
    </div>
  );
}
