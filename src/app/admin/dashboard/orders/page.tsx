'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, ShoppingBag, MapPin, CreditCard, Filter, Search, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react'

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
  const [dateRange, setDateRange] = useState('jan-1')

  // Status configurations
  const statusConfig: Record<Order['orderStatus'], StatusConfig> = {
    pending: {
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: <Clock className="h-4 w-4" />,
      label: 'Pending',
      nextStatus: 'processing',
      action: 'Process Order'
    },
    processing: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: <Package className="h-4 w-4" />,
      label: 'Processing',
      nextStatus: 'shipped',
      action: 'Ship Order'
    },
    shipped: {
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: <Truck className="h-4 w-4" />,
      label: 'Shipped',
      nextStatus: 'delivered',
      action: 'Mark Delivered'
    },
    delivered: {
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CheckCircle className="h-4 w-4" />,
      label: 'Delivered'
    },
    cancelled: {
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
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
  const StatCard = ({ title, value, change, isPositive }: { 
    title: string
    value: number
    change: string
    isPositive: boolean 
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          {change}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          </div>
          
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Orders" value={stats.total.value} change={stats.total.change} isPositive={stats.total.isPositive} />
          <StatCard title="Order Items" value={stats.orderItems.value} change={stats.orderItems.change} isPositive={stats.orderItems.isPositive} />
          <StatCard title="Returns" value={stats.returns.value} change={stats.returns.change} isPositive={stats.returns.isPositive} />
          <StatCard title="Fulfilled Orders" value={stats.fulfilled.value} change={stats.fulfilled.change} isPositive={stats.fulfilled.isPositive} />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="unfulfilled">Unfulfilled</option>
                <option value="unpaid">Unpaid</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            value={filteredOrders}
            selection={selectedOrders}
            onSelectionChange={(e) => setSelectedOrders(e.value)}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            className="p-datatable-sm"
            responsiveLayout="scroll"
            emptyMessage={
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            }
            loading={loading}
          >
            <Column selectionMode="multiple" style={{ width: '3em' }} />
            <Column 
              field="_id" 
              header="Order" 
              sortable
              body={(rowData: Order) => (
                <div className="font-medium text-gray-900">
                  #{rowData._id.slice(-4)}
                </div>
              )}
            />
            <Column 
              field="createdAt" 
              header="Date" 
              sortable
              body={(rowData: Order) => (
                <div className="text-gray-500">
                  {new Date(rowData.createdAt).toLocaleDateString()}
                </div>
              )}
            />
            <Column 
              field="shippingAddress" 
              header="Customer" 
              sortable
              body={(rowData: Order) => (
                <div className="font-medium text-gray-900">
                  {`${rowData.shippingAddress.firstName} ${rowData.shippingAddress.lastName}`}
                </div>
              )}
            />
            <Column 
              field="paymentDetails" 
              header="Payment" 
              body={(rowData: Order) => (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rowData.paymentDetails.method === 'Success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {rowData.paymentDetails.method}
                </div>
              )}
            />
            <Column 
              field="total" 
              header="Total" 
              sortable
              body={(rowData: Order) => (
                <div className="font-medium text-gray-900">
                  ₹{rowData.total.toFixed(2)}
                </div>
              )}
            />
            <Column 
              field="items" 
              header="Items" 
              body={(rowData: Order) => (
                <div className="text-gray-500">
                  {rowData.items.length} items
                </div>
              )}
            />
            <Column 
              field="orderStatus" 
              header="Status" 
              sortable
              body={(rowData: Order) => {
                const status = statusConfig[rowData.orderStatus]
                return (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>
                )
              }}
            />
            <Column 
              body={(rowData: Order) => (
                <div className="flex items-center gap-2">
                  <button 
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => {
                      setSelectedOrder(rowData)
                      setShowDialog(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              )}
              style={{ width: '4rem' }}
            />
          </DataTable>
        </div>

        {/* Order Details Dialog */}
        <Dialog
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          header="Order Details"
          modal
          style={{ width: '90%', maxWidth: '800px' }}
          className="p-dialog-custom"
          contentClassName="bg-white"
          maskClassName="bg-black/75"
          draggable={false}
          resizable={false}
        >
          {selectedOrder && (
            <div className="space-y-6 bg-white">
              {/* Order Status Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  {statusConfig[selectedOrder.orderStatus].icon}
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    statusConfig[selectedOrder.orderStatus].bgColor
                  } ${statusConfig[selectedOrder.orderStatus].color}`}>
                    {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                  </span>
                </div>
                <span className="text-gray-500">
                  Order Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Order Items</h3>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0 bg-white rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-semibold text-lg text-gray-900">₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Customer and Payment Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 leading-relaxed">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                      {selectedOrder.shippingAddress.address}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-4">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.paymentDetails.method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium text-gray-900">{selectedOrder.paymentDetails.razorpay_payment_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDialog(false)}
                  label="Close"
                />
                {statusConfig[selectedOrder.orderStatus].nextStatus && (
                  <Button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                    onClick={() => {
                      updateOrderStatus(selectedOrder._id, statusConfig[selectedOrder.orderStatus].nextStatus!)
                      setShowDialog(false)
                    }}
                    label={statusConfig[selectedOrder.orderStatus].action}
                  />
                )}
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  )
}