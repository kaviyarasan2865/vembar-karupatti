'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, ShoppingBag, MapPin, CreditCard, Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image';
// Interfaces
interface OrderItem {
  name: string
  quantity: number
  price: number
  image?: string
}

interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface PaymentDetails {
  method: string
  razorpay_payment_id: string
}

interface Order {
  _id: string
  items: OrderItem[]
  total: number
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: ShippingAddress
  paymentDetails: PaymentDetails
}

interface StatusConfig {
  color: string
  bgColor: string
  borderColor: string
  icon: React.ReactNode
  label: string
  nextStatus?: Order['orderStatus']
  action?: string
}

export default function OrdersPage() {
  // State
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
  const toast = useRef<Toast>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  // Status configurations
  const statusConfig = {
    pending: {
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
      icon: <Clock className="h-4 w-4" />,
      label: 'Pending',
      nextStatus: 'processing',
      action: 'Process Order'
    },
    processing: {
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      icon: <Package className="h-4 w-4" />,
      label: 'Processing',
      nextStatus: 'shipped',
      action: 'Ship Order'
    },
    shipped: {
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      icon: <Truck className="h-4 w-4" />,
      label: 'Shipped',
      nextStatus: 'delivered',
      action: 'Mark Delivered'
    },
    delivered: {
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      icon: <CheckCircle className="h-4 w-4" />,
      label: 'Delivered'
    },
    cancelled: {
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      icon: <XCircle className="h-4 w-4" />,
      label: 'Cancelled'
    }
  }

  // Stats calculation
  const stats = useMemo(() => ({
    total: {
      value: orders.length,
      change: '+25.2% last week',
      isPositive: true
    },
    orderItems: {
      value: orders.reduce((acc, order) => acc + order.items.length, 0),
      change: '+18.2% last week',
      isPositive: true
    },
    returns: {
      value: 0,
      change: '-1.2% last week',
      isPositive: false
    },
    fulfilled: {
      value: orders.filter(order => order.orderStatus === 'delivered').length,
      change: '+15.2% last week',
      isPositive: true
    }
  }), [orders])

  // Fetch orders
  const fetchOrders = useCallback(async (retryCount = 0) => {
    try {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      if (retryCount < 3) {
        setTimeout(() => fetchOrders(retryCount + 1), 1000 * Math.pow(2, retryCount))
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch orders. Please try refreshing the page.',
          life: 5000
        })
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: Order['orderStatus']) => {
    const previousOrders = [...orders]
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, orderStatus: newStatus } : order
    ))

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order')

      toast.current?.show({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Order status has been updated to ${newStatus}`,
        life: 3000
      })
    } catch (error) {
      setOrders(previousOrders)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update order status. Please try again.',
        life: 3000
      })
    }
  }, [orders])

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Components
  const StatCard = ({ title, value, change, isPositive, icon }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        {change}
      </div>
    </div>
  )
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status]
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    )
  }
  // Pagination calculation
  const paginatedOrders = useMemo(() => {
    const sortedOrders = [...filteredOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const startIndex = (currentPage - 1) * ordersPerPage
    return sortedOrders.slice(startIndex, startIndex + ordersPerPage)
  }, [filteredOrders, currentPage])

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const PaginationControls = () => (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * ordersPerPage + 1, filteredOrders.length)}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{filteredOrders.length}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === idx + 1
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Orders" 
          value={stats.total.value} 
          change={stats.total.change} 
          isPositive={stats.total.isPositive}
          icon={<ShoppingBag className="h-5 w-5 text-gray-400" />}
        />
        <StatCard 
          title="Order Items" 
          value={stats.orderItems.value} 
          change={stats.orderItems.change} 
          isPositive={stats.orderItems.isPositive}
          icon={<Package className="h-5 w-5 text-gray-400" />}
        />
        <StatCard 
          title="Returns" 
          value={stats.returns.value} 
          change={stats.returns.change} 
          isPositive={stats.returns.isPositive}
          icon={<XCircle className="h-5 w-5 text-gray-400" />}
        />
        <StatCard 
          title="Fulfilled Orders" 
          value={stats.fulfilled.value} 
          change={stats.fulfilled.change} 
          isPositive={stats.fulfilled.isPositive}
          icon={<CheckCircle className="h-5 w-5 text-gray-400" />}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order._id.slice(-4)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowDialog(true)
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationControls />
      </div>

      {/* Order Details Modal */}
      {showDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {selectedOrder && (
                  <div className="space-y-6">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center pb-4 border-b">
                      <h3 className="text-lg font-medium">Order Details</h3>
                      <StatusBadge status={selectedOrder.orderStatus} />
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Order Items
                      </h4>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              {item.image && (
                                <Image 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium">₹{item.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-bold">Total Amount</span>
                        <span className="font-bold text-lg">₹{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Customer and Payment Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <MapPin className="h-5 w-5" />
                          Shipping Address
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                          {selectedOrder.shippingAddress.address}<br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </p>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
                          <CreditCard className="h-5 w-5" />
                          Payment Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-medium">{selectedOrder.paymentDetails.method}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment ID:</span>
                            <span className="font-medium">{selectedOrder.paymentDetails.razorpay_payment_id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedOrder && statusConfig[selectedOrder.orderStatus].nextStatus && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, statusConfig[selectedOrder.orderStatus].nextStatus!)
                      setShowDialog(false)
                    }}
                  >
                    {statusConfig[selectedOrder.orderStatus].action}
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDialog(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}