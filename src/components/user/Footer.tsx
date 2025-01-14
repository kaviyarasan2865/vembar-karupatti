import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <footer id="footer" className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-500">
              Natural Jaggery
            </h3>
            <p className="text-gray-400">
              Bringing nature's sweetness to your table with traditional wisdom
              and modern standards.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Natural Jaggery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Jaggery Powder
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Liquid Jaggery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Gift Packs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition"
                >
                  Wholesale
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates about our products and offers
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-neutral-800 py-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2023 Natural Jaggery. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 text-sm"
              >
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
