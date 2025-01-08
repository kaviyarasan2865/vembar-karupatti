import React from 'react'
import aboutus from '../../../public/assets/aboutus.png'
import Image from 'next/image'

const Aboutus = () => {
  return (
    <>
    <section className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-[#FEF3C7]">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="mb-4">
              Welcome to our company! We are dedicated to providing the best products and
              services to help you succeed. Our team of experts is committed to delivering quality
              and excellence in every aspect of our work.
            </p>
            <p>
              With years of experience in the industry, we strive to innovate and meet the evolving
              needs of our customers. Our mission is to build lasting relationships based on trust,
              transparency, and mutual success.
            </p>
          </div>
          <div className="relative h-96">
            <Image 
              src={aboutus}
              alt="Our products"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-3xl "
            />
          </div>
        </div>
      </section>

    </>
  )
}

export default Aboutus