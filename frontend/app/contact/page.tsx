"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function ContactPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold uppercase">Contact Us</h1>
        <p className="mt-2 text-sm text-gray-300 max-w-md mx-auto">
          Have questions or need more information? Fill out the form below and we will get back to you shortly.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-xl"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#" className="text-xl"><FontAwesomeIcon icon={faFacebookF} /></a>
        </div>
      </div>

      {/* Form */}
      <form className="max-w-3xl mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="bg-black border border-white px-4 py-2 w-full outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-black border border-white px-4 py-2 w-full outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="tel"
            placeholder="Phone (Optional)"
            className="bg-black border border-white px-4 py-2 w-full outline-none"
          />
        </div>
        <textarea
          placeholder="Message"
          rows={4}
          className="bg-black border border-white px-4 py-2 w-full outline-none"
        />
        <button
          type="submit"
          className="border border-white px-6 py-2 font-semibold uppercase hover:bg-white hover:text-black transition"
        >
          Send Message
        </button>
      </form>

      {/* Contact Info */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 text-center gap-8 max-w-3xl mx-auto border-t border-gray-700 pt-12">
        <div>
          <div className="text-2xl mb-2"><FontAwesomeIcon icon={faEnvelope} /></div>
          <h3 className="text-lg font-bold uppercase">Email</h3>
          <p className="text-sm">info@example.com</p>
        </div>
        <div>
          <div className="text-2xl mb-2"><FontAwesomeIcon icon={faPhone} /></div>
          <h3 className="text-lg font-bold uppercase">Call</h3>
          <p className="text-sm">(123) 456-7890</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-xs text-gray-400">
        ©2024 United S.T.O.R.M. Basketball
      </footer>
    </div>
  );
}
