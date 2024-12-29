"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductsDetails = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const ITEMS_TO_SHOW = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/[user]/products"); // Call the API endpoint
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {products.slice(0, ITEMS_TO_SHOW).map((product) => (
            <div
              key={product.id}
              className="w-full relative h-[300px] overflow-hidden group mx-auto dark:bg-black bg-white dark:border-0 border rounded-md dark:text-white text-black flex flex-col"
            >
              <div className="w-full h-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="scale-105 group-hover:scale-100 object-cover transition-all duration-300 rounded-md"
                  priority
                />
              </div>

              <article className="p-8 w-full h-full overflow-hidden z-10 absolute top-0 flex flex-col justify-end rounded-md bg-[#F59E0B] opacity-0 group-hover:opacity-90 transition-all duration-300">
                <div className="translate-y-10 group-hover:translate-y-0 transition-all duration-300 space-y-2">
                  <h1 className="md:text-2xl font-semibold text-white">
                    {product.name}
                  </h1>
                  <p className="sm:text-base text-sm text-white">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-white font-semibold">{product.price}</p>
                    <button
                      onClick={() => router.push("./product-display")}
                      className="p-2 bg-black flex rounded-md text-white"
                    >
                      View Details <ChevronsRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {hasMoreProducts && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push("./product-listings")}
              className="px-6 py-3 bg-[#F59E0B] text-white rounded-md hover:bg-[#D97706] transition-colors duration-300 flex items-center"
            >
              Show All Products <ChevronsRight className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsDetails;
