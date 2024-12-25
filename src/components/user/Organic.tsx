import React from 'react'

const Organic = () => {
  return (
    <>
    <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Organic?</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              'High Nutritional Value',
              'Preserves the Environment',
              'Certified Organic Sources',
              'No Chemicals & Pesticides',
            ].map((benefit) => (
              <div key={benefit} className="p-4">
                <h3 className="font-semibold mb-2">{benefit}</h3>
                <p className="text-gray-600 text-sm">
                  Experience the benefits of organic products for a healthier lifestyle.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Organic