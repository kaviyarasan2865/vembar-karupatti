"use client";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReviewSection from "@/components/user/ReviewSection";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { cartEventEmitter, CART_UPDATED_EVENT } from "@/cartEventEmitter";

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
  image2?: string;
  image3?: string;
}

interface CartItem {
  productId: string;
  unitIndex: number;
  quantity: number;
  name: string;
  price: number;
  stock: number;
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/user/products/${resolvedParams.id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
        setMainImage(data.image);
      } catch (error: unknown) {
        console.error("Error:", error);
        toast.error(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  const handleImageSwap = (newImage: string) => {
    setMainImage(newImage);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.units[selectedUnit].stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (product && !isNaN(value)) {
      const maxStock = product.units[selectedUnit].stock;
      setQuantity(Math.min(Math.max(1, value), maxStock));
    }
  };

  const calculateOriginalPrice = (price: number, discount: number): number => {
    return Number((price / (1 - discount / 100)).toFixed(2));
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!product || product.units[selectedUnit].stock === 0) {
      toast.error(
        "This product is out of stock and cannot be added to the cart."
      );
      return;
    }

    const currentUnit = product.units[selectedUnit];
    const cartItem = {
      productId: product._id,
      name: product.name,
      image: product.image,
      unitIndex: selectedUnit,
      quantity: quantity,
      price: currentUnit.price,
      stock: currentUnit.stock,
    };

    try {
      // Check if the item is already in the cart
      const cartResponse = await fetch("/api/cart");
      if (!cartResponse.ok) throw new Error("Failed to fetch cart");
      const cartData = await cartResponse.json();
      const existingItem = cartData.find(
        (item: CartItem) =>
          item.productId === cartItem.productId &&
          item.unitIndex === cartItem.unitIndex
      );

      if (existingItem) {
        toast.error(
          "Product already exists in the cart. Please visit the cart."
        );
        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add item to cart");
      }

      cartEventEmitter.emit(CART_UPDATED_EVENT); // Add this line
      toast.success("Item added to cart");
    } catch (error: unknown) {
      console.error("Add to cart error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add item to cart"
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-20 flex justify-center items-center min-h-screen">
          <div className="text-red-500">Product not found</div>
        </div>
        <Footer />
      </>
    );
  }

  const thumbnails = [
    product.image,
    ...(product.image2 ? [product.image2] : []),
    ...(product.image3 ? [product.image3] : []),
  ];

  const currentUnit = product.units[selectedUnit];

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative w-full h-[350px] mb-4 bg-gray-100">
              <Image
                src={mainImage || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                priority
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.currentTarget;
                  target.src = "/placeholder.jpg";
                }}
              />
              {currentUnit.discount > 0 && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  {currentUnit.discount}% OFF
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {thumbnails.map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 bg-gray-100 cursor-pointer"
                  onClick={() => handleImageSwap(img)}
                >
                  <Image
                    src={img || "/placeholder.jpg"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.currentTarget;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {/* Unit Selection */}
            <div className="mb-6">
              <label className="block text-sm mb-2">Select Unit</label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {product.units.map((unit, index) => (
                  <option key={index} value={index}>
                    {unit.quantity} {unit.unit} - ₹{unit.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              <span className="text-2xl font-bold">₹{currentUnit.price}</span>
              {currentUnit.discount > 0 && (
                <span className="ml-2 text-gray-500 line-through">
                  ₹
                  {calculateOriginalPrice(
                    currentUnit.price,
                    currentUnit.discount
                  )}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm mb-2">Quantity</label>
              <div className="flex items-center space-x-2">
                <button
                  className="w-8 h-8 bg-amber-100 rounded-md hover:bg-amber-200"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={currentUnit.stock}
                  className="w-16 text-center border rounded-md"
                />
                <button
                  className="w-8 h-8 bg-amber-100 rounded-md hover:bg-amber-200"
                  onClick={incrementQuantity}
                >
                  +
                </button>
                <span className="text-sm text-gray-500">
                  ({currentUnit.stock} available)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                className={`px-6 py-2 bg-amber-600 text-white border border-amber-600 rounded-full hover:bg-amber-700 ${
                  currentUnit.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-600 text-white"
                }`}
                onClick={handleAddToCart}
                disabled={currentUnit.stock === 0}
              >
                Add to Cart
              </button>
              <button
                onClick={() => router.push("/cart-page")}
                className="px-6 py-2 bg-amber-600 text-white border border-amber-600 rounded-full hover:bg-amber-700"
              >
                Buy Now
              </button>
            </div>

            {/* Product Details List */}
            <div>
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-amber-800 rounded-full"></span>
                  <span>
                    Unit: {currentUnit.quantity} {currentUnit.unit}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-amber-800 rounded-full"></span>
                  <span>Stock Available: {currentUnit.stock}</span>
                </li>
                {currentUnit.discount > 0 && (
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-amber-800 rounded-full"></span>
                    <span>Discount: {currentUnit.discount}% off</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ReviewSection productId={product._id} />
      <Footer />
    </>
  );
};

export default Page;
