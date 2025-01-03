"use client"
import React, { useEffect, useState } from "react";
import { BookmarkIcon, ChevronDownIcon } from "lucide-react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

interface Unit {
  unit: string;
  quantity: number;
  discount: number;
  price: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  units: Unit[];
  image: string;
}

interface CartItem {
  productId: string;
  unitIndex: number;
  quantity: number;
}

const ProductListings = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: number }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const initialSelectedUnits = products.reduce((acc, product) => {
      acc[product._id] = 0; // Default to first unit option
      return acc;
    }, {} as { [key: string]: number });
    setSelectedUnits(initialSelectedUnits);
  }, [products]);

  useEffect(() => {
    // Initialize quantities along with selected units
    const initialQuantities = products.reduce((acc, product) => {
      acc[product._id] = 1; // Default quantity to 1
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [products]);

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => {
      const currentUnit = products
        .find(p => p._id === productId)
        ?.units[selectedUnits[productId]];
      
      const newQuantity = Math.max(1, Math.min((prev[productId] || 1) + delta, currentUnit?.stock || 1));
      return { ...prev, [productId]: newQuantity };
    });
  };

  const calculateTotalPrice = (product: Product, unitIndex: number, quantity: number) => {
    const unit = product.units[unitIndex];
    return Number((unit.price * quantity).toFixed(2));
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="p-4 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="p-4 flex justify-center items-center min-h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
        <Footer />
      </>
    );
  }

  const calculateOriginalPrice = (price: number, discount: number): number => {
    return Number((price / (1 - discount / 100)).toFixed(2));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] w-full">
          {products.map((product) => {
            const selectedUnitIndex = selectedUnits[product._id] || 0;
            const currentUnit = product.units[selectedUnitIndex];
            const quantity = quantities[product._id] || 1;
            const totalPrice = calculateTotalPrice(product, selectedUnitIndex, quantity);

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  {currentUnit.discount > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                        {currentUnit.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        {product.units.length > 1 ? (
                          <select
                            value={selectedUnits[product._id]}
                            onChange={(e) => setSelectedUnits({
                              ...selectedUnits,
                              [product._id]: Number(e.target.value)
                            })}
                            className="w-full p-2 pl-3 text-sm border border-amber-200 rounded-lg appearance-none bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 transition-all text-gray-700"
                          >
                            {product.units.map((unit, index) => (
                              <option key={index} value={index}>
                                {unit.quantity} {unit.unit}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="p-2 text-sm bg-amber-50/50 rounded-lg border border-amber-200">
                            {currentUnit.quantity} {currentUnit.unit}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-center items-end">
                        <span className="text-lg font-bold text-amber-600">
                          ₹{currentUnit.price.toFixed(2)}
                        </span>
                        {currentUnit.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{calculateOriginalPrice(currentUnit.price, currentUnit.discount)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-amber-50/50 p-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(product._id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-amber-300 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-amber-300 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
                          disabled={quantity >= currentUnit.stock}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-amber-600">₹{totalPrice}</div>
                        <div className="text-xs text-gray-500">Stock: {currentUnit.stock}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      className="p-2 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                      aria-label="Save for later"
                    >
                      <BookmarkIcon className="w-4 h-4 text-amber-600" />
                    </button>
                    <button 
                      className="flex-1 bg-amber-600 text-white rounded-lg py-2 text-sm hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      disabled={!currentUnit.stock}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};  

export default ProductListings;