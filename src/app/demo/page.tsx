"use client"
import Navbar from '@/components/user/Navbar'
import Hero from '@/components/user/Hero'
import Image from 'next/image'
import ProductsDetails from '@/components/user/ProductsDetails'
import Aboutus from '@/components/user/Aboutus'
import Organic from '@/components/user/Organic'
import Testimonial from '@/components/user/Testimonial'
import Footer from '@/components/user/Footer'
import ContactForm from '@/components/user/Contact'




export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <Hero/>

      {/* Products Section */}
      <ProductsDetails/>
      

      {/* About Section */}
    <Aboutus/>

      {/* Why Organic Section */}
      <Organic/>

      {/* Testimonials Section */}
      <Testimonial/>

      {/* Contact Section */}
      <ContactForm/>

      {/* Footer */}
      <Footer/>
    </main>
  )
}