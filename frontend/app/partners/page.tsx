"use client";
import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    name: "CSYBA",
    logo: "/images/partners/CSYBA.png",
    link: "#",
    description: "Calgary South Youth Basketball Association"
  },
  {
    name: "Alpha Business Consulting",
    logo: "/images/partners/ABC.jpg",
    link: "https://alphabusinessconsulting.ca/",
    description: "Strategic business solutions and consulting"
  },
  {
    name: "Jumpstart",
    logo: "/images/partners/jumpstart.png",
    link: "#",
    description: "Helping kids get in the game"
  },
  {
    name: "Greatway",
    logo: "/images/partners/greatway.png",
    link: "https://www.greatwayfinancial.com/",
    description: "Financial planning and wealth management"
  },
  {
    name: "KidSport",
    logo: "/images/partners/kidsport.png",
    link: "http://kidsportcanada.ca/",
    description: "Making sport accessible to all kids"
  },
];

export default function PartnersPage() {
  return (
    <div className="bg-black text-white min-h-screen px-4 py-12">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-wide">
          Our Partners
        </h1>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Together with our valued partners, we&apos;re building a stronger basketball community and creating opportunities for young athletes to excel.
        </p>
      </div>

      {/* Partners Grid */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, i) => (
            <div
              key={i}
              className="bg-black border border-gray-800 shadow-lg group hover:border-gray-600 transition-all duration-300"
            >
              {/* Logo Section */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-center h-24 mb-4">
                  <div className="relative w-32 h-16">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain transition-all duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 128px, 144px"
                      priority={i < 3}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="text-white font-bold text-lg text-center">${partner.name}</div>`;
                        }
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center uppercase tracking-wide">
                  {partner.name}
                </h3>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <p className="text-gray-300 text-center mb-4 leading-relaxed">
                  {partner.description}
                </p>
                
                {/* Visit Website Button */}
                {partner.link !== "#" && (
                  <div className="text-center">
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-white px-4 py-2 inline-block font-bold hover:bg-white hover:text-black transition"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-black border border-gray-800 p-8">
          <h2 className="text-2xl font-bold uppercase mb-4 tracking-wide">
            Join Our Team of Partners
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Partner with us to support youth basketball development and make a lasting impact in our community. Together, we can create opportunities for the next generation of athletes.
          </p>
          <Link
            href="/sponsor-us"
            className="border border-white px-6 py-3 inline-block font-bold hover:bg-white hover:text-black transition"
          >
            Become a Sponsor
          </Link>
        </div>
      </div>
    </div>
  );
}

