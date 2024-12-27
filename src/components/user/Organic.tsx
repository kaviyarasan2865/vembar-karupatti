import React from 'react'
import Image from 'next/image';
import hnv from '../../../public/assets/hnv.png'

const Organic = () => {
  const benefits = [
    {
      title: 'High Nutritional Value',
      image: hnv,
      alt: 'Nutritional Value Illustration'
    },
    {
      title: 'Preserves the Environment',
      image: hnv,
      alt: 'Environmental Preservation Illustration'
    },
    {
      title: 'Certified Organic Sources',
      image: hnv,
      alt: 'Organic Certification Illustration'
    },
    {
      title: 'No Chemicals & Pesticides',
      image: hnv,
      alt: 'Chemical-free Farming Illustration'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Organic?</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="p-4">
              <div className="mb-4">
                <Image
                  src={benefit.image}
                  alt={benefit.alt}
                  className="mx-auto rounded-lg w-full max-w-[200px] h-auto"
                />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">
                Experience the benefits of organic products for a healthier lifestyle.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Organic