"use client";
import React from "react";
import jaggery from "../../../public/assets/jaggery.png"
import Image from "next/image";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen pt-16 bg-neutral-900 text-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between py-20">
          <div className="w-full lg:w-1/2 space-y-8 mt-8 lg:mt-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover Pure{" "}
              <span className="text-amber-500">Natural Jaggery</span> Products
            </h1>
            <p className="text-xl text-gray-300">
              Experience the authentic taste of tradition with our premium,
              organic jaggery products. Handcrafted for your health and
              wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition duration-300 ease-in-out"
              >
                Explore Products
              </a>
              <a
                href="#process"
                className="inline-flex items-center justify-center px-8 py-3 border border-amber-500 text-base font-medium rounded-md text-amber-500 hover:bg-amber-500 hover:text-white transition duration-300 ease-in-out"
              >
                Learn More
              </a>
            </div>
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500">100%</p>
                <p className="text-sm text-gray-400">Natural</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500">0</p>
                <p className="text-sm text-gray-400">Additives</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500">50+</p>
                <p className="text-sm text-gray-400">Products</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 pl-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-amber-500 rounded-full blur-3xl opacity-30"></div>
              <div className="relative aspect-square rounded-full bg-neutral-800 flex items-center justify-center">
                <div className="text-9xl text-amber-500 ">
                  <Image src={jaggery} alt="jag" width={200} height={200} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-auto ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full block"
        >
          <path
            fill="#262626"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,133.3C960,128,1056,96,1152,80C1248,64,1344,64,1392,64L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
