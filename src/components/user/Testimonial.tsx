"use client"
import React from 'react';
import Marquee from 'react-fast-marquee';

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Businessman',
    text: 'The service was excellent, and the team was incredibly helpful. I highly recommend them to anyone looking for quality and professionalism.'
  },
  {
    id: 2,
    name: 'John Doe2',
    role: 'Businessman',
    text: 'Innovative and creative. The service was excellent, and the team was incredibly helpful. I highly recommend them to anyone looking for quality and professionalism.'
  },
  {
    id: 3,
    name: 'John Doe3',
    role: 'Businessman',
    text: 'The service was excellent, and the team was incredibly helpful. I highly recommend them to anyone looking for quality and professionalism.'
  },
  {
    id: 4,
    name: 'John Doe4',
    role: 'Businessman',
    text: 'The service was excellent, and the team was incredibly helpful. I highly recommend them to anyone looking for quality and professionalism.'
  }
];

const Testimonials = () => {
  return (
    <div className="relative h-96 bg-gray-200 overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-4">
          <div className="flex items-start mb-12 max-w-4xl mx-auto justify-between">
            <div className="text-4xl text-orange-500 font-serif"> </div>
            <h2 className="text-3xl font-bold ml-4">Kind words from our clients</h2>
            <div className = "text-4xl text-orange-500 font  ml-4"> </div>
          </div>
          
          <Marquee pauseOnHover={true} speed={50} gradient={false}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-[350px] h-[200px] mx-4 p-6 bg-white rounded-lg shadow-lg flex flex-col justify-between"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic line-clamp-3">{testimonial.text}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;