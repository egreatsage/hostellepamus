'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-[#272727] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-[#EFD09E] text-xl font-bold hover:text-[#D4AA7D] transition-colors duration-300">
              YourLogo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#EFD09E] hover:bg-[#D4AA7D] hover:text-[#272727] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              href="/get-started"
              className="bg-[#D4AA7D] text-[#272727] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#EFD09E] transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#EFD09E] hover:text-[#D4AA7D] focus:outline-none focus:text-[#D4AA7D] transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#272727] border-t border-[#D4AA7D]/20">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#EFD09E] hover:bg-[#D4AA7D] hover:text-[#272727] block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/get-started"
            className="bg-[#D4AA7D] text-[#272727] block px-3 py-2 rounded-md text-base font-medium hover:bg-[#EFD09E] transition-colors duration-300 mt-4 text-center"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;