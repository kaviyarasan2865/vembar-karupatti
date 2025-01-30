'use client'

import { useEffect, useState } from "react"
import { Check, ChevronRight, CreditCard, MapPin, Truck } from 'lucide-react'
import Navbar from "@/components/user/Navbar"
import Footer from "@/components/user/Footer"
import { loadRazorpay } from '@/lib/razorpay'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import razor from "../../../public/assets/razor.png"
import Image from "next/image"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
  unitIndex: number
}

interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Define Razorpay instance type
interface RazorpayInstance {
  open: () => void
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: {
    name: string
    email: string
    contact: string
  }
  handler: (response: RazorpayResponse) => void
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'online'
  })
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    items: [],
    subtotal: 0,
    shipping: 49,
    tax: 0,
    total: 0
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const initializeRazorpayPayment = async () => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderSummary.total,
          currency: 'INR',
        }),
      })
      
      const order = await response.json()

      // Load Razorpay SDK with proper typing
      const Razorpay = await loadRazorpay() as unknown as RazorpayConstructor

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKeyId) {
        throw new Error('Razorpay key is not configured')
      }

      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: orderSummary.total * 100,
        currency: 'INR',
        name: 'Vembar Karupatti',
        description: 'Purchase Description',
        order_id: order.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        handler: function (response: RazorpayResponse) {
          fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items: orderSummary.items,
                shippingAddress: formData,
                subtotal: orderSummary.subtotal,
                shipping: orderSummary.shipping,
                tax: orderSummary.tax,
                total: orderSummary.total
              }
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Payment verification failed')
            }
            return response.json()
          })
          .then(result => {
            router.push(`/order-success?orderId=${result.orderId}`)
          })
          .catch(error => {
            console.error('Payment verification failed:', error)
            toast.error('Payment verification failed. Please contact support.')
          })
        },
      }

      const paymentObject = new Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Payment initialization failed:', error)
      toast.error('Payment initialization failed. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'delivery') {
      setStep('payment');
    } else {
      try {
        if (formData.paymentMethod === 'online') {
          await initializeRazorpayPayment();
        } else {
          // Handle COD order
          const response = await fetch('/api/orders/cod', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderData: {
                items: orderSummary.items,
                shippingAddress: formData,
                subtotal: orderSummary.subtotal,
                shipping: orderSummary.shipping,
                tax: orderSummary.tax,
                total: orderSummary.total
              }
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create COD order');
          }

          const result = await response.json();
          router.push(`/order-success?orderId=${result.orderId}`);
        }
      } catch (error) {
        console.error('Order creation failed:', error);
        toast.error('Failed to create order. Please try again.');
      }
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/user/details');
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - maybe redirect to login
          return;
        }
        if (response.status === 404) {
          // User exists but no details yet - leave form empty
          return;
        }
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || ''
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Optionally show an error message to the user
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart items');
      const items = await response.json(); // This is now an array directly
      
      const subtotal = items.reduce((sum: number, item: CartItem) => 
        sum + (item.price * item.quantity), 0);
      const tax = Math.round(subtotal * 0.03); // 3% tax

      setOrderSummary({
        items, // Use the array directly
        subtotal,
        shipping: 49,
        tax,
        total: subtotal + 49 + tax
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      // Set empty state on error
      setOrderSummary({
        items: [],
        subtotal: 0,
        shipping: 49,
        tax: 0,
        total: 49
      });
    }
  };

  // const updateUserDetails = async () => {
  //   try {
  //     const response = await fetch('/api/user/details', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         ...formData,
  //         zipcode: formData.zipCode
  //       })
  //     });
  //     if (!response.ok) throw new Error("Failed to update user details");
  //     console.log('User details updated successfully');
  //   } catch (error) {
  //     console.error('Error updating user details:', error);
  //   }
  // }
  
  useEffect(()=>{
    fetchUserDetails();
    fetchCartItems();
  },[]);

  return (
    <div>
      <Navbar />
    <div className=" pt-20 min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Checkout</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white">
                    <MapPin className="h-3 w-3" />
                  </div>
                  <span className={step === 'delivery' ? "font-medium" : "text-gray-500"}>Delivery</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    step === 'payment' ? "bg-amber-600 text-white" : "border border-gray-200"
                  }`}>
                    <CreditCard className="h-3 w-3" />
                  </div>
                  <span className={step === 'payment' ? "font-medium" : "text-gray-500"}>Payment</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <form onSubmit={handleSubmit}>
                {step === 'delivery' ? (
                  <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Delivery Information</h2>
                    <div className="grid gap-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Street address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            disabled
                            className="mt-1 block hover:cursor-not-allowed w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="TN">Tamil Nadu</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                            PIN code
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            pattern="[0-9]{6}"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={formData.paymentMethod === 'online'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Pay Online</p>
                              <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                            </div>
                          </div>
                          <Image src={razor} alt="Razorpay" 
                          width={100}
                          height={100}
                          className=" object-fill" />
                        </div>
                      </label>

                      <label className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                        />
                        <div className="flex items-center space-x-3">
                          <Truck className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-gray-500">Pay when you receive</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 p-6">
                  {step === 'payment' && (
                    <button
                      type="button"
                      onClick={() => setStep('delivery')}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                      Back to Delivery
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-auto rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    {step === 'delivery' ? (
                      <>
                        Continue to Payment
                        <ChevronRight className="ml-2 -mr-1 h-4 w-4 inline-block" />
                      </>
                    ) : (
                      <>
                        Place Order
                        <Check className="ml-2 -mr-1 h-4 w-4 inline-block" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <div className="mt-6 space-y-4">
                  {/* {orderSummary.items.map((item, index) => ( */}
                  {orderSummary.items.map((item) => (
                    <div key={`${item.productId}-${item.unitIndex}`} className="flex items-start space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}

                  <div className="my-6 border-t border-gray-200" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Subtotal</p>
                      <p className="font-medium">₹{orderSummary.subtotal}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Shipping</p>
                      <p className="font-medium">₹{orderSummary.shipping}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Tax</p>
                      <p className="font-medium">₹{orderSummary.tax}</p>
                    </div>
                  </div>

                  <div className="my-6 border-t border-gray-200" />

                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-semibold">₹{orderSummary.total}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-amber-50 p-3">
                  <Truck className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-gray-500">Thursday, 15 Feb - Saturday, 17 Feb</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  )
}

