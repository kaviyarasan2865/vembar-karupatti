"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  initial: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Update items per slide based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2); // Tablet
      } else {
        setItemsPerSlide(3); // Desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testimonials: Testimonial[] = [
    {
      initial: "R",
      name: "Rahul Sharma",
      role: "Health Enthusiast",
      text: "I switched to natural jaggery for my family, and we couldn't be happier. The authentic taste and health benefits are amazing!",
      rating: 5,
    },
    {
      initial: "P",
      name: "Priya Patel",
      role: "Nutritionist",
      text: "As a nutritionist, I highly recommend these jaggery products. They're pure, natural, and retain all the essential minerals.",
      rating: 5,
    },
    {
      initial: "A",
      name: "Amit Kumar",
      role: "Regular Customer",
      text: "The quality and taste of these jaggery products are unmatched. My children love the natural sweetness!",
      rating: 5,
    },
    {
      initial: "B",
      name: "Amit Kumar",
      role: "Regular Customer",
      text: "The quality and taste of these jaggery products are unmatched. My children love the natural sweetness!",
      rating: 5,
    },
    {
      initial: "T",
      name: "Rahul Sharma",
      role: "Health Enthusiast",
      text: "I switched to natural jaggery for my family, and we couldn't be happier. The authentic taste and health benefits are amazing!",
      rating: 5,
    },
    {
      initial: "F",
      name: "Priya Patel",
      role: "Nutritionist",
      text: "As a nutritionist, I highly recommend these jaggery products. They're pure, natural, and retain all the essential minerals.",
      rating: 5,
    },
  ];

  // Calculate total number of slides needed based on items per slide
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  const nextSlide = () => {
    if (!isLastSlide) setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!isFirstSlide) setCurrentSlide((prev) => prev - 1);
  };

  // Show navigation if there are more testimonials than items per slide
  const showNavigation = testimonials.length > itemsPerSlide;

  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 mt-4">
            Discover why people love our natural jaggery products
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="flex flex-nowrap min-w-full">
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex w-full flex-shrink-0">
                  {testimonials
                    .slice(
                      slideIndex * itemsPerSlide,
                      slideIndex * itemsPerSlide + itemsPerSlide
                    )
                    .map((testimonial, index) => (
                      <div
                        key={index}
                        className={`px-4 ${
                          itemsPerSlide === 1
                            ? "w-full"
                            : itemsPerSlide === 2
                            ? "w-1/2"
                            : "w-1/3"
                        }`}
                      >
                        <div className="bg-white rounded-xl p-6 sm:p-8 h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <div className="flex items-center mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                              {testimonial.initial}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <h3 className="text-gray-900 font-bold text-sm sm:text-base">
                                {testimonial.name}
                              </h3>
                              <p className="text-gray-600 text-xs sm:text-sm">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-6 text-sm sm:text-base">
                            {testimonial.text}
                          </p>
                          <div className="flex text-amber-500">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Only shown if needed */}
          {showNavigation && (
            <>
              <button
                onClick={prevSlide}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full text-white transition-all duration-300 z-10 ${
                  isFirstSlide
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-amber-500 hover:bg-amber-600 cursor-pointer"
                }`}
                disabled={isFirstSlide}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 rounded-full text-white transition-all duration-300 z-10 ${
                  isLastSlide
                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                    : "bg-amber-500 hover:bg-amber-600 cursor-pointer"
                }`}
                disabled={isLastSlide}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
