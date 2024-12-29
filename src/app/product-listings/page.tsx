import React from "react";
import { BookmarkIcon } from "lucide-react";
import Image from "next/image";
import sugar from "../../../public/assets/LightBrownSugar.png";
import karupetti from "../../../public/assets/karupetti.png";
import brown from "../../../public/assets/brown.png";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

const ProductListings = () => {
  const products = [
    {
      id: 1,
      name: "Strawberry",
      image: sugar,
      price: "₹79",
      originalPrice: "₹143.84",
      discount: "45% OFF",
      weight: "200 g",
      sponsored: true,
      brand: "fresho!",
    },
    {
      id: 2,
      name: "Mushrooms - Button",
      image: brown,
      price: "₹48.22",
      originalPrice: "₹60.27",
      discount: "20% OFF",
      weight: "1 pack - (Approx. 180g - 200 g)",
      sponsored: true,
      brand: "fresho!",
    },
    {
      id: 3,
      name: "Broccoli",
      image: karupetti,
      price: "₹45",
      originalPrice: "₹58.9",
      discount: "24% OFF",
      weight: "1 pc - (Approx. 250g-500g)",
      sponsored: true,
      brand: "fresho!",
    },
    {
      id: 4,
      name: "Broccoli",
      image: karupetti,
      price: "₹45",
      originalPrice: "₹58.9",
      discount: "24% OFF",
      weight: "1 pc - (Approx. 250g-500g)",
      sponsored: true,
      brand: "fresho!",
    },
    {
      id: 5,
      name: "Mushrooms - Button",
      image: sugar,
      price: "₹48.22",
      originalPrice: "₹60.27",
      discount: "20% OFF",
      weight: "1 pack - (Approx. 180g - 200 g)",
      sponsored: true,
      brand: "fresho!",
    },
    {
      id: 6,
      name: "Strawberry",
      image: brown,
      price: "₹79",
      originalPrice: "₹143.84",
      discount: "45% OFF",
      weight: "200 g",
      sponsored: true,
      brand: "fresho!",
    },
  ];

  return (
    <>
    <Navbar/>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="absolute top-2 left-2 bg-green-800 text-white text-xs px-2 py-1 rounded">
                  {product.discount}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  {product.sponsored && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      👑 Sponsored
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  <span className="text-gray-600 text-sm">{product.brand}</span>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  {product.weight}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-semibold">{product.price}</span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="p-2 border border-gray-200 rounded">
                    <BookmarkIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="flex-1 bg-white text-red-500 border border-red-500 rounded py-2 px-4 hover:bg-red-50 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProductListings;
