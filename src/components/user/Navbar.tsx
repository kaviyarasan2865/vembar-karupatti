"use client";
import React, { useState } from "react";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#78350F]">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            {/* Logo Placeholder */}
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <a href="#" className="text-white text-xl font-bold">
              Vembar
            </a>
            <a href="#" className="text-[#42D400] text-xl font-bold">
              Karupatti
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014]"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014]"
            >
              About
            </a>
            <a
              href="#"
              className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014]"
            >
              Contact
            </a>
            <a
              href="/login"
              className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014]"
            >
              Login
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-[#b65014] focus:outline-none focus:ring-2 focus:ring-white"
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
        <div className="md:hidden bg-[#78350F] space-y-2 px-4 py-3">
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
          >
            Home
          </a>
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
          >
            About
          </a>
          <a
            href="#"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
          >
            Contact
          </a>
          <a
            href="/login"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;