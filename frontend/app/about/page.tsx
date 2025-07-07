"use client";
import Image from "next/image";
import { DEFAULT_IMAGE } from "../constants";

export default function AboutUsPage() {
  return (
    <div className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background Image (CSS-based) */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/aboutUs/backgroundImg.png')" }}
      >
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
          <h2 className="text-2xl font-bold uppercase mb-3">History</h2>
          <p className="text-gray-200 leading-relaxed">
            United S.T.O.R.M. has been a family-owned youth basketball club in Calgary since 2010.
            We offer trainings and teams all year round. Every spring season we’ve had 14–20 girls’
            and boys’ teams from ages 9 to 18. Many athletes from our program have gone on to play
            at the college and university levels. Though based in Calgary, we proudly welcome players
            from across Alberta.
          </p>
          <p className="text-gray-200 leading-relaxed mt-4">
            Our teams have competed in tournaments across Canada and the U.S., including cities like
            Las Vegas, LA, Phoenix, San Diego, and even Mexico City. We also host our own tournaments
            with visiting teams from Hawaii, Winnipeg, Vancouver, and more. We’ve built a competitive
            and connected basketball culture over the years.
          </p>
        </section>

        {/* Philosophy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase mb-3">Philosophy</h2>
          <p className="text-gray-200 leading-relaxed">
            Our program focuses on more than just basketball. STORM teaches strength, togetherness,
            opportunity, resilience, and multicultural values through sport. We believe the skills
            learned on the court — discipline, teamwork, focus — translate into skills for life.
          </p>
          <p className="text-gray-200 leading-relaxed mt-4">
            We’re committed to creating an inclusive environment that welcomes newcomers of all skill
            levels. We value effort, growth, and motivation just as much as talent. There’s no shortcut
            to success — it’s built through hard work and commitment over time.
          </p>
        </section>

        {/* Coaches */}
        <section>
          <h2 className="text-2xl font-bold uppercase mb-3">Coaches</h2>
          <p className="text-gray-200 leading-relaxed">
            Our coaching staff consists of experienced, knowledgeable mentors who are deeply invested
            in youth development. Many have competed or coached at the collegiate and professional levels.
            They emphasize basketball IQ, strategy, and personal growth through high-quality training.
          </p>
          <p className="text-gray-200 leading-relaxed mt-4">
            Practices cover conditioning, skill work, and situational play — everything from footwork and
            dribbling to reading pressure and executing under stress. Every athlete learns to lead, hustle,
            and execute at a high level — both in game and in life.
          </p>
        </section>
      </main>
    </div>
  );
}



