"use client"
import React from 'react'
import background from "../../../public/assets/Background.png"
import Image from 'next/image'


const Hero = () => {
  return (
    <>
    <section className="relative h-[700px]">
        <Image
          src={background}
          alt="Palm tree at sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto h-full flex flex-col items-center justify-center text-white text-center">
            <div className="bg-black/50 p-12 rounded-lg backdrop-transparent-sm max-w-2xl border">
              <h1 className="text-5xl font-bold mb-4">Welcome to Our Website</h1>
              <p className="mb-6">We offer amazing services to help you succeed</p> 
              <button className="bg-[#F59E0B] hover:bg-[#78350F] px-6 py-2 rounded-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero