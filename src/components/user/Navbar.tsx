"use client";
import React, { useState, useEffect } from "react";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UserCircle, ShoppingCart, ShoppingBag, Search } from "lucide-react";
import { cartEventEmitter, CART_UPDATED_EVENT } from '../../cartEventEmitter';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { data: session, status } = useSession();

  const fetchCartCount = async () => {
    if (status === 'authenticated') {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          const totalItems = data.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    } else {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCartCount();

    // Set up event listener
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    cartEventEmitter.on(CART_UPDATED_EVENT, handleCartUpdate);
    
    // Cleanup
    return () => {
      cartEventEmitter.off(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, [status]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-[#78350F]">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <Link href="/" className="text-white text-xl font-bold">
              Vembar
            </Link>
            <Link href="/" className="text-[#42D400] text-xl font-bold">
              Karupatti
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/product-listings"
              className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014]"
            >
              <ShoppingBag />
            </Link>
            <Link
              href="/cart-page"
              className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014] relative"
            >
              <ShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2  bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {status === 'loading' ? (
              <div className="w-8 h-8 animate-pulse bg-[#b65014] rounded-full" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white hover:bg-[#b65014] px-3 py-2 rounded-md"
                >
                  <UserCircle className="w-6 h-6" />
                  <span className="text-sm">{session.user.email?.split('@')[0]}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-white px-3 py-2 rounded-md text-base font-regular hover:bg-[#b65014]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-[#b65014]"
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
          <Link
            href="/"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
          >
            Home
          </Link>
          <Link
            href="/product-listings"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
          >
            Products
          </Link>
          <Link
            href="/cart-page"
            className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014] relative inline-flex items-center"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
              >
                Profile
              </Link>
              <Link
                href="/orders"
                className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
              >
                Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#b65014]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;