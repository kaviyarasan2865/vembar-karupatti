"use client"
import React from 'react'
import sugar from '../../../public/assets/LightBrownSugar.png'
import karupetti from '../../../public/assets/karupetti.png'
import brown from '../../../public/assets/brown.png'
import Image from 'next/image'

const products = [
  {
    id: 1,
    name: 'Light Brown Sugar',
    image: sugar,
    price: '$4.99'
  },
  {
    id: 2,
    name: 'Dark Brown Sugar',
    image: karupetti,
    price: '$5.99'
  },
  {
    id: 3,
    name: 'Raw Sugar',
    image: brown,
    price: '$6.99'
  }
];

const ProductsDetails = () => {
  return (
    <>
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ">
                <div className="relative h-48 ">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.price}</p>
                  <button className="bg-[#F59E0B] hover:bg-[#78350F] text-white px-6 py-2 rounded-md transition-colors">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductsDetails