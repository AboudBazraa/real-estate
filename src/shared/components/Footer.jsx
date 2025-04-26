import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300"
            >
              Almukalla
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Your trusted partner in finding the perfect property. Discover
              homes, apartments, and commercial properties in prime locations.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="text-zinc-500 hover:text-blue-500 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-zinc-500 hover:text-pink-500 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-zinc-500 hover:text-blue-400 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-zinc-500 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/search"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/registration"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
              Property Types
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?type=apartment"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=villa"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=land"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Land Plots
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=commercial"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="text-blue-500 flex-shrink-0 mt-0.5"
                />
                <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                  123 Real Estate Ave, Al Mukalla, Yemen
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                  +967 123 456 789
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                  info@almukalla-realestate.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            © {currentYear} Almukalla Real Estate. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <Link
              href="/privacy-policy"
              className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
