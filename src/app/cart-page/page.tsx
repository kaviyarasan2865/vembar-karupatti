"use client";
import { useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchCartItems } from "@/store/cartSlice";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (session) {
      dispatch(fetchCartItems());
    } else {
      toast.error("Please login to view your cart");
      router.push("/login");
    }
  }, [dispatch, session, router]);

  const updateQuantity = async (productId: string, unitIndex: number, newQuantity: number) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, unitIndex, quantity: newQuantity }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      
      // Refresh cart items after update
      dispatch(fetchCartItems());
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeProduct = async (productId: string, unitIndex: number) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, unitIndex }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      
      // Refresh cart items after removal
      dispatch(fetchCartItems());
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
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
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => router.push('/product-listings')}
                  className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.unitIndex}`}
                  className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
                >
                  <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      Price: ₹{item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: {item.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.unitIndex, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.unitIndex, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeProduct(item.productId, item.unitIndex)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <p className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{totalItems}</span>
                </p>
                <p className="flex justify-between text-lg font-semibold">
                  <span>Total Price:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
