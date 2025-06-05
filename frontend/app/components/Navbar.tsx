"use client";
// import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
      {/* Logo */}
      {/* <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div> */}

      {/* Links */}
      <ul className="hidden md:flex items-center space-x-6 font-semibold uppercase tracking-wide text-sm">
        <li><a href="#" className="hover:text-gray-400">About Us</a></li>
        <li><a href="#" className="hover:text-gray-400">Registration</a></li>
        <li><a href="#" className="hover:text-gray-400">Merchandise</a></li>
        <li><a href="#" className="hover:text-gray-400">Media</a></li>
        <li><a href="#" className="hover:text-gray-400">Proud partners</a></li>
        <li>
          <a
            href="#"
            className="border border-white rounded px-4 py-1 hover:bg-white hover:text-black transition"
          >
            Register Now
          </a>
        </li>
      </ul>
    </nav>
  );
}
