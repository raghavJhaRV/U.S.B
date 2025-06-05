"use client"


const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                {/* Logo */}
                <div className="flex flex-col items-start">
                    <img src="/logo.png" alt="United STORM Logo" className="h-16 mb-4" />
                </div>

                {/* Learn More */}
                <div>
                    <h3 className="font-bold mb-2 uppercase">Learn More</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Teams</a></li>
                        <li><a href="#">Schedule</a></li>
                        <li><a href="#">News</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                {/* Get Started */}
                <div>
                    <h3 className="font-bold mb-2 uppercase">Get Started</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li><a href="#">Registration</a></li>
                        <li><a href="#">Join a Team</a></li>
                        <li><a href="#">Support</a></li>
                    </ul>
                </div>

                {/* Follow Us */}
                <div>
                    <h3 className="font-bold mb-2 uppercase">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#"><img src="/instagram.svg" alt="Instagram" className="h-5 w-5" /></a>
                        <a href="#"><img src="/facebook.svg" alt="Facebook" className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-10 text-gray-400 text-xs">
                <p className="mb-1">
                    <span className="font-semibold text-white">Strength. Together. Opportunity. Resilience. Multicultural.</span>
                </p>
                <p>© 2024 United S.T.O.R.M. Basketball</p>
            </div>
        </footer>
    );
};

export default Footer;
