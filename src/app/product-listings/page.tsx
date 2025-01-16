"use client";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, Search, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cartEventEmitter, CART_UPDATED_EVENT } from "@/cartEventEmitter";

interface Unit {
  unit: string;
  quantity: number;
  discount: number;
  price: number;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  categoryName?: string;
  isActive: boolean;
  units: Unit[];
  image: string;
}

const ProductListings = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: number }>(
    {}
  );
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All Products",
  ]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get unique category names from products
  const categoryNames = [
    "All Products",
    ...new Set(products.map((product) => product.categoryName).filter(Boolean)),
  ];

  const priceRanges = [
    { label: "Under ₹100", min: 0, max: 100 },
    { label: "₹100 - ₹500", min: 100, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "Above ₹1000", min: 1000, max: Infinity },
  ];

  // Fetch both products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories first
        const categoryResponse = await fetch("/api/categories");
        if (!categoryResponse.ok) {
          throw new Error(`HTTP error! status: ${categoryResponse.status}`);
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        // Then fetch products
        const productResponse = await fetch("/api/user/products");
        if (!productResponse.ok) {
          throw new Error(`HTTP error! status: ${productResponse.status}`);
        }
        const productData = await productResponse.json();

        // Map category IDs to names
        const productsWithCategoryNames = productData.map(
          (product: Product) => {
            const category = categoryData.find(
              (cat: Category) => cat._id === product.category
            );
            return {
              ...product,
              categoryName: category ? category.name : "Uncategorized",
            };
          }
        );

        setProducts(productsWithCategoryNames);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const initialSelectedUnits = products.reduce((acc, product) => {
      acc[product._id] = 0;
      return acc;
    }, {} as { [key: string]: number });
    setSelectedUnits(initialSelectedUnits);
  }, [products]);

  useEffect(() => {
    const initialQuantities = products.reduce((acc, product) => {
      acc[product._id] = 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [products]);

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const currentUnit = products.find((p) => p._id === productId)?.units[
        selectedUnits[productId]
      ];

      const newQuantity = Math.max(
        1,
        Math.min((prev[productId] || 1) + delta, currentUnit?.stock || 1)
      );
      return { ...prev, [productId]: newQuantity };
    });
  };

  const calculateTotalPrice = (
    product: Product,
    unitIndex: number,
    quantity: number
  ) => {
    const unit = product.units[unitIndex];
    return Number((unit.price * quantity).toFixed(2));
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product-display/${productId}`);
  };

  const handleAddToCart = async (
    product: Product,
    unitIndex: number,
    quantity: number
  ) => {
    try {
      const selectedUnit = product.units[unitIndex];
      const response = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch cart");
      }

      const cartItems = await response.json();
      const existingItem = cartItems.find(
        (item: any) =>
          item.productId === product._id && item.unitIndex === unitIndex
      );

      if (existingItem) {
        toast.error("Item already in cart");
        return;
      }

      const addResponse = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          image: product.image,
          unitIndex: unitIndex,
          quantity: quantity,
          price: selectedUnit.price,
          stock: selectedUnit.stock,
        }),
      });

      if (!addResponse.ok) {
        const error = await addResponse.json();
        throw new Error(error.error || "Failed to add item to cart");
      }

      // Emit cart updated event after successful addition
      cartEventEmitter.emit(CART_UPDATED_EVENT);
      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    }
  };

  // Filter and search logic
  useEffect(() => {
    let results = [...products];

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes("All Products")
    ) {
      results = results.filter((product) =>
        selectedCategories.includes(product.categoryName || "Uncategorized")
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        results = results.filter((product) => {
          const lowestPrice = Math.min(...product.units.map((u) => u.price));
          return lowestPrice >= range.min && lowestPrice < range.max;
        });
      }
    }

    setFilteredProducts(results);
  }, [products, searchTerm, selectedCategories, selectedPriceRange]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 p-4 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pt-20 p-4 flex justify-center items-center min-h-screen">
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
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 px-4 lg:px-8 pb-20">
          {/* Search and Filter Toggle */}
          <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-amber-500/50 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="flex-1 flex gap-4 items-center w-full max-w-2xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {(searchTerm ||
                selectedCategories.length > 1 ||
                selectedPriceRange) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories(["All Products"]);
                    setSelectedPriceRange("");
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto flex gap-6">
            {/* Filter Sidebar */}
            <div
              className={`lg:w-64 space-y-6 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              {/* Categories */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-amber-500/30 transition-colors shadow-sm">
                <h3 className="font-semibold mb-3 text-gray-900">Categories</h3>
                <div className="space-y-2">
                  {categoryNames.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 text-gray-600 hover:text-amber-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (category === "All Products") {
                            setSelectedCategories(
                              e.target.checked ? ["All Products"] : []
                            );
                          } else {
                            setSelectedCategories((prev) => {
                              const newCategories = e.target.checked
                                ? [
                                    ...prev.filter((c) => c !== "All Products"),
                                    category,
                                  ]
                                : prev.filter((c) => c !== category);
                              return newCategories.length === 0
                                ? ["All Products"]
                                : newCategories;
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-amber-500/30 transition-colors shadow-sm">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 text-gray-600 hover:text-amber-600 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === range.label}
                        onChange={() => setSelectedPriceRange(range.label)}
                        className="text-amber-600 focus:ring-amber-500 bg-gray-200 border-gray-300"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-gray-500 text-lg mb-4">
                    No products found
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategories(["All Products"]);
                      setSelectedPriceRange("");
                    }}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const selectedUnitIndex = selectedUnits[product._id] || 0;
                    const currentUnit = product.units[selectedUnitIndex];
                    const quantity = quantities[product._id] || 1;
                    const totalPrice = calculateTotalPrice(
                      product,
                      selectedUnitIndex,
                      quantity
                    );

                    return (
                      <div
                        key={product._id}
                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 group ${
                          currentUnit.stock === 0
                            ? "grayscale hover:grayscale-0"
                            : ""
                        }`}
                      >
                        <div
                          className="relative aspect-[16/9] overflow-hidden bg-gray-100 cursor-pointer"
                          onClick={() => handleProductClick(product._id)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                          />
                          {currentUnit.stock === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Out of Stock
                              </span>
                            </div>
                          )}
                          {currentUnit.stock > 0 &&
                            currentUnit.discount > 0 && (
                              <div className="absolute top-2 left-2">
                                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                                  {currentUnit.discount}% OFF
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                              {product.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="relative">
                                {product.units.length > 1 ? (
                                  <>
                                    <select
                                      value={selectedUnits[product._id]}
                                      onChange={(e) =>
                                        setSelectedUnits({
                                          ...selectedUnits,
                                          [product._id]: Number(e.target.value),
                                        })
                                      }
                                      className="w-full p-2 pl-3 pr-8 text-sm bg-gray-50 border border-gray-200 text-gray-900 rounded-lg appearance-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                                    >
                                      {product.units.map((unit, index) => (
                                        <option key={index} value={index}>
                                          {unit.quantity} {unit.unit}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                                  </>
                                ) : (
                                  <div className="p-2 text-sm bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
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
                                    ₹
                                    {calculateOriginalPrice(
                                      currentUnit.price,
                                      currentUnit.discount
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    updateQuantity(product._id, -1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-amber-600 hover:border-amber-500 transition-colors disabled:opacity-50"
                                  disabled={quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(product._id, 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-amber-600 hover:border-amber-500 transition-colors disabled:opacity-50"
                                  disabled={quantity >= currentUnit.stock}
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-amber-600">
                                  ₹{totalPrice}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Stock: {currentUnit.stock}
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleAddToCart(
                                product,
                                selectedUnitIndex,
                                quantity
                              )
                            }
                            className="w-full bg-amber-600 text-white rounded-lg py-2 text-sm hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            disabled={!currentUnit.stock}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductListings;
