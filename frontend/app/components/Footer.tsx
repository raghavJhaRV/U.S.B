"use client"

import { DEFAULT_IMAGE } from "../constants"; 
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                {/* Logo */}
                <div className="flex flex-col items-start">
                    <img src={DEFAULT_IMAGE} alt="United STORM Logo" className="h-30 mb-4" />
                </div>

                {/* Learn More */}
                <div>
                    <h3 className="font-bold mb-2 uppercase">Learn More</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/news">News</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Get Started */}
                <div>
                    <h3 className="font-bold mb-2 uppercase">Get Started</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li><Link href="/registration">Registration</Link></li>
                        <li><Link href="/sponsor-us">Sponsor Us</Link></li>
                    </ul>
                </div>

                {/* Follow Us */}
                <div>
                    <h3 className="font-bold mb-2 uppercase">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a
                            href="https://www.instagram.com/united.storm.basketball"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
                        </a>
                        <a
                            href="https://www.facebook.com/unitedstormbasketball/?ref=_xav_ig_profile_page_web"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faFacebookF} className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-10 text-gray-400 text-xs">
                <p className="mb-1">
                    <span className="font-semibold text-white">
                        Strength. Together. Opportunity. Resilience. Multicultural.
                    </span>
                </p>
                <p>© 2024 United S.T.O.R.M. Basketball</p>
            </div>
        </footer>
    );
};

export default Footer;
