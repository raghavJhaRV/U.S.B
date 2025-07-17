"use client";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_IMAGE } from "../constants"; 

export default function Navbar() {
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

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center space-x-6 font-semibold uppercase tracking-wide text-sm">
        <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
        <li><Link href="/about" className="hover:text-gray-400">About</Link></li>
        {/*<li><Link href="/registration" className="hover:text-gray-400">Registration</Link></li>*/}
        <li><Link href="/merchandise" className="hover:text-gray-400">Merchandise</Link></li>
        <li><Link href="/media" className="hover:text-gray-400">Media</Link></li>
        {/*<li><Link href="/training" className="hover:text-gray-400">Training</Link></li>*/}
        <li><Link href="/events" className="hover:text-gray-400">Events</Link></li>
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
    </nav>
  );
}
