"use client";
// import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
      {/* Logo */}
      {/* <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div> */}

      {/* Links */}
      <ul className="hidden md:flex items-center space-x-6 font-semibold uppercase tracking-wide text-sm">
        <li><Link href="/about" className="hover:text-gray-400">About Us</Link></li>
        <li><Link href="/registration" className="hover:text-gray-400">Registration</Link></li>
        <li><Link href="/merchandise" className="hover:text-gray-400">Merchandise</Link></li>
        <li><Link href="/media" className="hover:text-gray-400">Media</Link></li>
        <li><Link href="/partners" className="hover:text-gray-400">Proud Partners</Link></li>
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
