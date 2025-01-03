"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id?: string | number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  discount?: number;
}

const ProductsDetails = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const ITEMS_TO_SHOW = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/user/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const hasMoreProducts = products.length > ITEMS_TO_SHOW;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Products
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {products.slice(0, ITEMS_TO_SHOW).map((product, index) => (
            <div
              key={product.id ?? `product-${index}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group relative"
            >
              {/* Product Image Container */}
              <div className="relative h-[250px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                  priority
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Overlay Content - Visible on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => router.push("./product-display")}
                  className="px-6 py-3 bg-[#F59E0B] text-white rounded-md hover:bg-[#D97706] transition-colors flex items-center gap-2"
                >
                  View Details <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMoreProducts && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => router.push("./product-listings")}
              className="px-6 py-3 bg-[#F59E0B] text-white rounded-md hover:bg-[#D97706] transition-colors flex items-center gap-2 text-lg"
            >
              View All Products <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsDetails;