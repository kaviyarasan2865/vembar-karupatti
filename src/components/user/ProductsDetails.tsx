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

  const handleProductClick = (productId: string) => {
    router.push(`/product-display/${productId}`);
  };

  return (
    <section className="py-20 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-neutral-600">
            Discover our most loved traditional jaggery products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, ITEMS_TO_SHOW).map((product, index) => (
            <div
              key={product.id ?? `product-${index}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 group relative"
            >
              {/* Product Image */}
              <div className="relative h-[250px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {product.discount}% OFF
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2 text-center">
                  {product.name}
                </h3>
                <p className="text-neutral-600 text-center mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-amber-600 font-bold text-xl">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <p className="text-sm text-neutral-500 line-through">
                        {product.originalPrice}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleProductClick(product.id as string)}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition flex items-center gap-2"
                  >
                    View Details
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMoreProducts && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("./product-listings")}
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-[8px] hover:bg-neutral-800 transition-colors duration-300 font-medium text-sm"
            >
              View All Products
              <span className="ml-2">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsDetails;
