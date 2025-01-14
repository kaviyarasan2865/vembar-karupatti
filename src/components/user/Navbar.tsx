"use client";
import React, { useState, useEffect } from "react";
import logo from "../../../public/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  UserCircle,
  ShoppingCart,
  ShoppingBag,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cartEventEmitter, CART_UPDATED_EVENT } from "../../cartEventEmitter";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchCartCount = async () => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          const totalItems = data.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );
          setCartItemCount(totalItems);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
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
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="fixed w-full z-50 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Simplified */}
          <div
            onClick={() => router.push("/")}
            className="flex-shrink-0 flex items-center gap-2 hover:cursor-pointer"
          >
            <Image
              src={logo}
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full border border-amber-400"
            />
            <span className="text-2xl font-bold text-amber-500">Vembar</span>
            <span className="text-2xl font-bold text-white">Karupatti</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/product-listings"
              className="hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </Link>

            <Link
              href="/cart-page"
              className="hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {status === "loading" ? (
              <div className="w-8 h-8 animate-pulse bg-amber-500/20 rounded-full" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>{session.user.email?.split("@")[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-neutral-700 hover:text-amber-500"
                    >
                      <span className="flex gap-2 items-center">
                        <UserCircle className="w-4 h-4" />
                        Profile
                      </span>
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm hover:bg-neutral-700 hover:text-amber-500"
                    >
                      <span className="flex gap-2 items-center">
                        <ShoppingBag className="w-4 h-4" />
                        Orders
                      </span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700"
                    >
                      <span className="flex gap-2 items-center">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-amber-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
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
        <div className="md:hidden bg-neutral-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/product-listings"
              className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium"
            >
              <span className="flex gap-2 items-center">
                <ShoppingBag className="w-4 h-4" />
                Products
              </span>
            </Link>
            <Link
              href="/cart-page"
              className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium"
            >
              <span className="flex gap-2 items-center">
                <ShoppingCart className="w-4 h-4" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </span>
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span className="flex gap-2 items-center">
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </span>
                </Link>
                <Link
                  href="/orders"
                  className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span className="flex gap-2 items-center">
                    <ShoppingBag className="w-4 h-4" />
                    Orders
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span className="flex gap-2 items-center">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block hover:text-amber-500 px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
