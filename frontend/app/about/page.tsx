"use client";
import Image from "next/image";
import { DEFAULT_IMAGE } from "../constants";

export default function AboutUsPage() {
  return (
    <div className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/images/aboutUs/backgroundImg.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src={DEFAULT_IMAGE}
            alt="U.S.B Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-center mb-4 tracking-wide">
          About Us
        </h1>
        <p className="text-center text-sm md:text-lg uppercase tracking-wider text-gray-200 mb-12">
          Strength. Together. Opportunity. Resilience. Multicultural.
        </p>

        {/* History */}
        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase mb-2">History</h2>
          <p className="text-gray-200 leading-relaxed">
            United S.T.O.R.M has been a family-owned basketball club in Calgary since 2010.
            We offer training and teams year-round. Each spring, we’ve had 14–20 girls and boys
            teams from ages 9 to 13. Many players have gone on to play college or university basketball.
            Though based in Calgary, we’ve welcomed players from all over Alberta.
          </p>
        </section>

        {/* Philosophy */}
        <section className="mb-12">
          <h2 className="text-xl font-bold uppercase mb-2">Philosophy</h2>
          <p className="text-gray-200 leading-relaxed">
            Our club promotes strength, teamwork, and diversity. We believe basketball builds character
            and resilience, helping kids navigate life’s challenges. Our inclusive environment supports
            growth for all athletes.
          </p>
        </section>

        {/* Coaches */}
        <section>
          <h2 className="text-xl font-bold uppercase mb-2">Coaches</h2>
          <p className="text-gray-200 leading-relaxed">
            Our passionate coaches have experience in post-secondary basketball and player development.
            They guide each athlete to reach their highest potential through structured teamwork,
            conditioning, and game IQ development.
          </p>
        </section>
      </main>
    </div>
  );
}
