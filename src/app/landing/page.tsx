"use client";
import React, { useState } from "react";
import logo from "../../../public/assets/logo.png";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#78350F]">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            {/* Logo Placeholder */}
            <img src={logo.src} alt="Logo" className="h-10 w-10 rounded-full" />
            <a href="#" className="text-white text-xl font-bold">
              Logo
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              About
            </a>
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Services
            </a>
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 space-y-2 px-4 py-3">
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Home
          </a>
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            About
          </a>
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Services
          </a>
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
