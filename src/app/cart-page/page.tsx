"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: string;
  name: string;
  image: string;
  unitIndex: number;
  quantity: number;
  price: number;
  stock: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchCartItems();
    } else {
      toast.error("Please login to view your cart");
      router.push("/login");
    }
  }, [session, router]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setItems(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };



const updateQuantity = async (productId: string, unitIndex: number, newQuantity: number) => {
  try {
    if (newQuantity < 1) {
      toast.error('Quantity cannot be less than 1');
      return;
    }

    const itemToUpdate = items.find(
      item => item.productId === productId && item.unitIndex === unitIndex
    );

    if (!itemToUpdate) {
      toast.error('Item not found');
      return;
    }

    if (newQuantity > itemToUpdate.stock) {
      toast.error('Cannot exceed available stock');
      return;
    }

    // Update local state optimistically
    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId && item.unitIndex === unitIndex
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    const response = await fetch('/api/cart/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        unitIndex,
        quantity: newQuantity
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Revert the local state if the API call fails
      await fetchCartItems();
      throw new Error(data.error || 'Failed to update quantity');
    }

    // Verify the response has the expected data structure
    if (Array.isArray(data.items)) {
      setItems(data.items);
      toast.success('Quantity updated successfully');
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error: any) {
    console.error('Update quantity error:', error);
    toast.error(error.message || 'Failed to update quantity');
    // Refresh cart items to ensure consistency
    await fetchCartItems();
  }
};

  const handleRemoveFromCart = async (productId: string, unitIndex: number) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, unitIndex }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }

      // Update local state immediately
      setItems(prevItems => 
        prevItems.filter(item => 
          !(item.productId === productId && item.unitIndex === unitIndex)
        )
      );

      toast.success('Item removed from cart successfully');
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      toast.error(error.message || 'Failed to remove item from cart');
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
                  key={`${item.productId}-unit-${item.unitIndex}`} // Updated unique key
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
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.unitIndex, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.productId, item.unitIndex)}
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