"use client";


export default function AboutUsPage() {
  return (
    <div className="bg-black text-white min-h-screen">


      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold uppercase text-center mb-6">
          About Us.
        </h1>
        <p className="text-center text-lg font-semibold mb-12 uppercase">
          Strength. Together. Opportunity. Resilience. Multicultural.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold uppercase mb-2">History</h2>
          <p className="text-gray-200">
            United S.T.O.R.M has been a family-owned basketball club in Calgary since 2010. 
            We offer training and teams year-round. Each spring season we’ve had 14–20 girls 
            and boys teams from ages 9 to 13. Many players have gone on to play college/university 
            basketball. Though based in Calgary, we’ve had players join from all over Alberta.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold uppercase mb-2">Philosophy</h2>
          <p className="text-gray-200">
            Our club teaches individual strength, teamwork, resilience, and celebrates diversity. 
            We believe basketball helps kids navigate life’s ups and downs and prepares them for 
            future challenges. Our environment is friendly, inclusive, and growth-oriented for 
            all newcomers regardless of skill level.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase mb-2">Coaches</h2>
          <p className="text-gray-200">
            Our coaches are passionate, experienced, and focused on player development. Many have 
            post-secondary playing experience or coaching backgrounds. We provide guidance to help 
            each athlete reach their potential, emphasizing teamwork, conditioning, and game IQ.
          </p>
        </section>
      </main>


    </div>
  );
}
