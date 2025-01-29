"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Aboutus = () => {
  const router = useRouter();
  return (
    <section id="about" className="py-20 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Grid with Features */}
          <div className="animate__animated animate__fadeInLeft">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-neutral-800 p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🌾",
                      title: "Traditional Process",
                      description: "Age-old methods preserved",
                    },
                    {
                      icon: "🌿",
                      title: "100% Natural",
                      description: "Pure and chemical-free",
                    },
                    {
                      icon: "💪",
                      title: "Nutritious",
                      description: "Rich in minerals",
                    },
                    {
                      icon: "🌍",
                      title: "Sustainable",
                      description: "Eco-friendly practices",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-neutral-700 p-6 rounded-xl transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 hover:border-amber-500/50 border-2 border-transparent cursor-pointer group"
                    >
                      <span className="text-4xl group-hover:scale-110 inline-block transition-transform duration-300">
                        {item.icon}
                      </span>
                      <h3 className="text-xl font-bold mt-4 group-hover:text-amber-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 animate__animated animate__fadeInRight">
            <div className="inline-block">
              <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Our Story
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Crafting Pure Sweetness{" "}
              <span className="text-amber-500">Since Decades</span>
            </h2>

            <p className="text-gray-400 text-lg">
              We&apos;ve been dedicated to preserving the traditional art of jaggery
              making while incorporating modern standards of quality and
              hygiene. Our journey began with a simple mission: to bring the
              purest form of natural sweetener to your table.
            </p>

            <div className="space-y-4">
              {[
                "Sourced from local farmers",
                "Traditional processing methods",
                "Quality assurance at every step",
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-amber-500" />
                  <span className="ml-2">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("./product-listings")}
              className="mt-8 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition duration-300 inline-flex items-center"
            >
              View our products
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;