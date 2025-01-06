'use client'

import { useState } from "react"
import { Check, ChevronRight, CreditCard, MapPin, Truck } from 'lucide-react'

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
    pincode: '',
    paymentMethod: 'online'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'delivery') {
      setStep('payment')
    } else {
      // Handle form submission
      console.log('Form submitted:', formData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Checkout</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <MapPin className="h-3 w-3" />
                  </div>
                  <span className={step === 'delivery' ? "font-medium" : "text-gray-500"}>Delivery</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    step === 'payment' ? "bg-blue-600 text-white" : "border border-gray-200"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select state</option>
                            <option value="KA">Karnataka</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="KL">Kerala</option>
                            <option value="MH">Maharashtra</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                            PIN code
                          </label>
                          <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            pattern="[0-9]{6}"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Pay Online</p>
                              <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                            </div>
                          </div>
                          <img src="/razorpay-logo.svg" alt="Razorpay" className="h-6" />
                        </div>
                      </label>

                      <label className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Back to Delivery
                    </button>
                  )}
                  <button
                    type="submit"
                    className="ml-auto rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  <div className="flex items-start space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg"
                        alt="Product"
                        className="object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">Cotton T-Shirt</h3>
                      <p className="text-sm text-gray-500">Size: M, Color: Black</p>
                      <p className="text-sm">Qty: 1</p>
                    </div>
                    <p className="font-medium">₹599</p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                      <img
                        src="/placeholder.svg"
                        alt="Product"
                        className="object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">Denim Jeans</h3>
                      <p className="text-sm text-gray-500">Size: 32, Color: Blue</p>
                      <p className="text-sm">Qty: 1</p>
                    </div>
                    <p className="font-medium">₹1,299</p>
                  </div>

                  <div className="my-6 border-t border-gray-200" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Subtotal</p>
                      <p className="font-medium">₹1,898</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Shipping</p>
                      <p className="font-medium">₹49</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Tax</p>
                      <p className="font-medium">₹53</p>
                    </div>
                  </div>

                  <div className="my-6 border-t border-gray-200" />

                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-semibold">₹2,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-50 p-3">
                  <Truck className="h-6 w-6 text-blue-600" />
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
  )
}

