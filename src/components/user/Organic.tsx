"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const Organic = () => {
  const router = useRouter();
  const benefits = [
    {
      icon: "💪",
      title: "Rich in Iron",
      description:
        "Natural source of iron that helps prevent anemia and maintains healthy blood levels.",
    },
    {
      icon: "🌿",
      title: "Natural Detoxifier",
      description:
        "Helps cleanse your liver and boost your body's natural detoxification process.",
    },
    {
      icon: "🦴",
      title: "Mineral Rich",
      description:
        "Contains essential minerals like calcium, phosphorus, and magnesium for bone health.",
    },
    {
      icon: "🌡️",
      title: "Boosts Immunity",
      description:
        "Strengthens immune system with its antioxidant properties and mineral content.",
    },
    {
      icon: "❤",
      title: "Heart Health",
      description:
        "Supports cardiovascular health with its potassium content and natural properties.",
    },
    {
      icon: "🌱",
      title: "100% Natural",
      description:
        "Free from chemicals and artificial additives, purely natural sweetener.",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <span className="text-amber-500 font-medium text-sm uppercase tracking-wider hover:text-amber-400 transition-colors duration-300">
            WHY CHOOSE NATURAL JAGGERY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">
            Health Benefits
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Discover the amazing health benefits of our traditional jaggery
            products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-xl p-6 group hover:bg-neutral-700/50 transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:border-amber-500/30 border border-transparent transition-all duration-300 animate__animated animate__fadeInUp"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-500/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300">
                <span className="text-3xl group-hover:animate-bounce">
                  {benefit.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => router.push("./product-listings")}
            className="inline-flex items-center bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] border border-transparent hover:border-amber-400/50 transition-all duration-300 animate__animated animate__fadeIn"
          >
            Try Our Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Organic;
