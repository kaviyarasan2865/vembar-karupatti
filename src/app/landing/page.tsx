"use client"
import Aboutus from '@/components/user/Aboutus'
import ContactForm from '@/components/user/Contact'
import Footer from '@/components/user/Footer'
import Hero from '@/components/user/Hero'
import Navbar from '@/components/user/Navbar'
import Organic from '@/components/user/Organic'
import ProductsDetails from '@/components/user/ProductsDetails'
import Testimonial from '@/components/user/Testimonial'

import { signOut } from "next-auth/react";
import {useRouter} from 'next/navigation'
import React from 'react'

const handleSignOut = async () => {
  try {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const landing = () => {
  const router = useRouter()
  return (
    <>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Sign out
      </button> 
      <Navbar />
      <Hero />
      <ProductsDetails />
      <Aboutus />
      <Organic />
      <Testimonial />
      <ContactForm />
      <Footer />
    </>
  );
}

export default landing