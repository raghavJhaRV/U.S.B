"use client";
import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    name: "CSYBA",
    logo: "/images/partners/CSYBA.png",
    link: "#",
  },
  {
    name: "Alpha Business Consulting",
    logo: "/images/partners/ABC.jpg",
    link: "https://alphabusinessconsulting.ca/",
  },
  {
    name: "Jumpstart",
    logo: "/images/partners/jumpstart.png",
    link: "#",
  },
  {
    name: "Greatway",
    logo: "/images/partners/Greatway.png",
    link: "https://www.greatwayfinancial.com/",
  },
  {
    name: "KidSport",
    logo: "/images/partners/kidsport.png",
    link: "http://kidsportcanada.ca/",
  },
];

export default function PartnersPage() {
  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center uppercase mb-12">
        Proud Partners
      </h1>

      {/* Partner Logo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 max-w-6xl mx-auto mb-16">
        {partners.map((partner, i) => (
          <a
            key={i}
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:scale-105 transition"
          >
            <div className="relative w-36 h-20 sm:w-40 sm:h-24 md:w-44 md:h-28">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100px, 150px"
              />
            </div>
          </a>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Interested in becoming a sponsor?
        </h2>
        <Link
          href="/sponsor-us"
          className="inline-block border border-white px-6 py-2 font-bold rounded hover:bg-white hover:text-black transition"
        >
          Sponsor Us
        </Link>
      </div>
    </div>
  );
}

