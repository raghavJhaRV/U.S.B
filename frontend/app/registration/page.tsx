"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegistrationPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <section className="text-center mt-16 px-4">
        <h1 className="text-5xl font-extrabold uppercase mb-10">Registration</h1>

        <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-5xl mx-auto">
          <a href="/registration/girls" className="relative w-full sm:w-1/2 group">
            <img src="/girls.jpg" alt="Girls" className="w-full h-[400px] object-cover rounded-md" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold uppercase mb-4">Girls</h2>
              <button className="border border-white px-6 py-2 rounded-md font-bold hover:bg-white hover:text-black transition">Register</button>
            </div>
          </a>

          <a href="/registration/boys" className="relative w-full sm:w-1/2 group">
            <img src="/boys.jpg" alt="Boys" className="w-full h-[400px] object-cover rounded-md" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-bold uppercase mb-4">Boys</h2>
              <button className="border border-white px-6 py-2 rounded-md font-bold hover:bg-white hover:text-black transition">Register</button>
            </div>
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
