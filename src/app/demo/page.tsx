"use client"
import Navbar from '@/components/user/Navbar'
import Hero from '@/components/user/Hero'
import Image from 'next/image'
import ProductsDetails from '@/components/user/ProductsDetails'
import Aboutus from '@/components/user/Aboutus'
import Organic from '@/components/user/Organic'
import Testimonial from '@/components/user/Testimonial'




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
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md">
                Send Message
              </button>
            </form>
            <div className="h-[400px] bg-gray-200 rounded-lg">
              {/* Map placeholder */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown-800 text-black py-12">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">CALL US</h3>
            <p>+1 (234) 567-8900</p>
            <p>Mon-Sat 9:00AM - 8:00PM</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">STORE ADDRESS</h3>
            <p>123 Main Street, Suite 100</p>
            <p>City, State 12345</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">NEWSLETTER</h3>
            <p className="mb-4">Stay updated with our latest offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md text-black flex-1"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md">
                OK
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}