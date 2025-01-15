"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

interface ProcessStep {
  emoji: string;
  title: string;
  description: string;
  position: "left" | "right";
}

const Process = () => {
  const processSteps: ProcessStep[] = [
    {
      emoji: "🌾",
      title: "Sugarcane Selection",
      description:
        "Carefully selecting the finest quality sugarcane from local farmers",
      position: "left",
    },
    {
      emoji: "⚙️",
      title: "Extraction Process",
      description:
        "Traditional crushing method to extract pure sugarcane juice",
      position: "right",
    },
    {
      emoji: "🔥",
      title: "Traditional Cooking",
      description:
        "Slow cooking in traditional vessels to maintain nutritional value",
      position: "left",
    },
    {
      emoji: "🧪",
      title: "Quality Check",
      description: "Rigorous quality testing to ensure purity and consistency",
      position: "right",
    },
    {
      emoji: "📦",
      title: "Packaging",
      description: "Eco-friendly packaging to preserve freshness and quality",
      position: "left",
    },
  ];

  return (
    <section id="process" className="py-20 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <span className="text-amber-600 font-bold text-sm uppercase tracking-wider hover:text-amber-700 transition-colors duration-300">
            OUR PROCESS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-4">
            Traditional Manufacturing Process
          </h2>
          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
            Discover how we maintain traditional methods while ensuring the
            highest quality standards
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-amber-500 h-full" />

          {/* Process Steps */}
          <div className="space-y-12">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center 
                  ${
                    step.position === "left"
                      ? "animate__animated animate__fadeInLeft"
                      : "animate__animated animate__fadeInRight"
                  }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Left Content */}
                <div
                  className={`flex-1 ${
                    step.position === "left"
                      ? "md:text-right md:pr-12"
                      : "md:text-left"
                  }`}
                >
                  {step.position === "left" && (
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] border border-transparent hover:border-amber-300/50 transform hover:-translate-y-1 transition-all duration-300 group">
                      <div className="mb-4">
                        <span className="text-4xl inline-block transform transition-transform duration-300 group-hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                          {step.emoji}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-neutral-600 group-hover:text-neutral-700">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:block w-12 h-12 bg-amber-500 rounded-full border-4 border-white shadow-lg transform translate-y-4 hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300" />

                {/* Right Content */}
                <div
                  className={`flex-1 ${
                    step.position === "right" ? "md:pl-12" : ""
                  } mt-4 md:mt-0`}
                >
                  {step.position === "right" && (
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] border border-transparent hover:border-amber-300/50 transform hover:-translate-y-1 transition-all duration-300 group">
                      <div className="mb-4">
                        <span className="text-4xl inline-block transform transition-transform duration-300 group-hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                          {step.emoji}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-neutral-600 group-hover:text-neutral-700">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] border border-transparent hover:border-amber-400/50 transition-all duration-300 inline-flex items-center animate__animated animate__fadeIn group">
            Learn More About Our Process
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Process;
