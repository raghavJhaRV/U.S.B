"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DEFAULT_IMAGE } from "../constants"; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white py-4 px-6 flex items-center justify-between shadow-md relative z-50">
      {/* Logo aligned and overflowing slightly */}
      <div className="relative -top-4">
        <Link href="/">
          <Image
            src={DEFAULT_IMAGE}
            alt="United STORM Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col space-y-1 p-2"
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex items-center space-x-6 font-semibold uppercase tracking-wide text-sm">
        <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
        <li><Link href="/about" className="hover:text-gray-400">About</Link></li>
        <li><Link href="/merchandise" className="hover:text-gray-400">Merchandise</Link></li>
        <li><Link href="/media" className="hover:text-gray-400">Media</Link></li>
        <li><Link href="/events" className="hover:text-gray-400">Events</Link></li>
        <li><Link href="/livestream" className="hover:text-gray-400">Live Streams</Link></li>
        <li><Link href="/news" className="hover:text-gray-400">News</Link></li>
        <li><Link href="/contact" className="hover:text-gray-400">Contact</Link></li>
        <li><Link href="/partners" className="hover:text-gray-400">Proud Partners</Link></li>
        <li><Link href="/calendar" className="hover:text-gray-400">Calendar</Link></li>
        <li>
          <Link
            href="/registration"
            className="border border-white rounded px-4 py-1 hover:bg-white hover:text-black transition"
          >
            Register Now
          </Link>
        </li>
      </ul>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <ul className="flex flex-col space-y-0 font-semibold uppercase tracking-wide text-sm">
          <li><Link href="/" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link href="/about" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link href="/merchandise" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Merchandise</Link></li>
          <li><Link href="/media" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Media</Link></li>
          <li><Link href="/events" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Events</Link></li>
          <li><Link href="/livestream" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Live Streams</Link></li>
          <li><Link href="/news" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>News</Link></li>
          <li><Link href="/contact" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link href="/partners" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Proud Partners</Link></li>
          <li><Link href="/calendar" className="block px-6 py-3 hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Calendar</Link></li>
          <li>
            <Link
              href="/registration"
              className="block px-6 py-3 border-t border-gray-700 hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Register Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
