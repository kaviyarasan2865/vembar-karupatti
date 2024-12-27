'use client'
import Footer from '@/components/user/Footer'
import Navbar from '@/components/user/Navbar'
import brown from '../../../public/assets/brown.png'
import sugar from '../../../public/assets/LightBrownSugar.png'
import Brown from '../../../public/assets/Brown-Sugar.png'
import Image from 'next/image'
import React, { useState } from 'react'

const Page = () => {
  const [mainImage, setMainImage] = useState(Brown)
  const thumbnails = [sugar, brown, sugar]

  const handleImageSwap = (newImage) => {
    setMainImage(newImage)
  }

  return (
    <>
      <Navbar />
      {/* Product Section */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-video mb-4 bg-gray-100">
              <Image
                src={mainImage}
                alt="Main product image"
                className="object-fill rounded-lg cursor-pointer"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {thumbnails.map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square bg-gray-100 cursor-pointer" 
                  onClick={() => handleImageSwap(img)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-fill rounded-lg"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">Product Name</h1>
            <p className="text-gray-600 mb-4">
              This is a detailed description of the product, it explains the key features, materials, and any
              other details that make the product unique.
            </p>
            <p className="text-2xl font-bold mb-6">$299.99</p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm mb-2">Quantity</label>
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 bg-gray-200 rounded-md">-</button>
                <input
                  type="number"
                  defaultValue={1}
                  className="w-16 text-center border rounded-md"
                />
                <button className="w-8 h-8 bg-gray-200 rounded-md">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button className="px-6 py-2 border border-brown-800 rounded-md hover:bg-gray-50">
                Add to Cart
              </button>
              <button className="px-6 py-2 bg-yellow-400 rounded-md hover:bg-yellow-500">
                Buy it now
              </button>
            </div>

            {/* Product Details List */}
            <div>
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-brown-800 rounded-full"></span>
                  <span>High-quality materials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-brown-800 rounded-full"></span>
                  <span>Available in multiple colors</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-brown-800 rounded-full"></span>
                  <span>1-year warranty included</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-brown-800 rounded-full"></span>
                  <span>30-day money-back guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Page