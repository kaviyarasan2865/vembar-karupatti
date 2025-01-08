'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, ShoppingBag, MapPin, CreditCard, Filter, Search } from 'lucide-react'

// Keep existing interfaces
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
  nextStatus?: Order['orderStatus']
  icon: React.ReactNode
  action?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<Order['orderStatus'] | 'all'>('all')
  const toast = useRef<Toast>(null)

  // Enhanced status configurations
  const statusConfig = useMemo<Record<Order['orderStatus'], StatusConfig>>(() => ({
    pending: {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      nextStatus: 'processing',
      icon: <Clock className="h-4 w-4" />,
      action: 'Accept Order'
    },
    processing: {
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      nextStatus: 'shipped',
      icon: <Package className="h-4 w-4" />,
      action: 'Mark as Shipped'
    },
    shipped: {
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      nextStatus: 'delivered',
      icon: <Truck className="h-4 w-4" />,
      action: 'Mark as Delivered'
    },
    delivered: {
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      icon: <CheckCircle className="h-4 w-4" />
    },
    cancelled: {
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      icon: <XCircle className="h-4 w-4" />
    }
  }), [])

  // Keep existing fetchOrders function
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

  // Keep existing updateOrderStatus function
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

  // Enhanced status template
  const statusBodyTemplate = useCallback((rowData: Order) => {
    const config = statusConfig[rowData.orderStatus]
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
          {config.icon}
          {rowData.orderStatus.charAt(0).toUpperCase() + rowData.orderStatus.slice(1)}
        </span>
      </div>
    )
  }, [statusConfig])

  // Enhanced actions template
  const actionsBodyTemplate = useCallback((rowData: Order) => {
    const config = statusConfig[rowData.orderStatus]
    return (
      <div className="flex gap-2">
        <Button
          icon={<Eye className="h-4 w-4" />}
          severity="info"
          size="small"
          className="p-button-rounded"
          onClick={() => {
            setSelectedOrder(rowData)
            setShowDialog(true)
          }}
          tooltip="View Details"
        />
        {config.nextStatus && (
          <Button
            icon={config.icon}
            severity="success"
            size="small"
            className="p-button-rounded"
            onClick={() => updateOrderStatus(rowData._id, config.nextStatus!)}
            tooltip={config.action}
          />
        )}
        {rowData.orderStatus === 'pending' && (
          <Button
            icon={<XCircle className="h-4 w-4" />}
            severity="danger"
            size="small"
            className="p-button-rounded"
            onClick={() => updateOrderStatus(rowData._id, 'cancelled')}
            tooltip="Cancel Order"
          />
        )}
      </div>
    )
  }, [statusConfig, updateOrderStatus])

  // Filter orders based on search and status
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track your orders efficiently</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-[300px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Order['orderStatus'] | 'all')}
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

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
          ) : (
            <DataTable
              value={filteredOrders}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              className="p-datatable-sm"
              stripedRows
              emptyMessage={
                <div className="text-center py-8 text-gray-500">
                  No orders found
                </div>
              }
              sortField="createdAt"
              sortOrder={-1}
              loading={loading}
              resizableColumns
              showGridlines
              responsiveLayout="scroll"
              scrollHeight="500px"
            >
              <Column 
                field="_id" 
                header="Order ID" 
                sortable 
                body={(rowData) => (
                  <span className="font-medium text-gray-900">
                    {rowData._id.slice(-6)}
                  </span>
                )}
              />
              <Column 
                field="shippingAddress.firstName" 
                header="Customer" 
                sortable 
                body={(rowData) => (
                  <div className="font-medium text-gray-900">
                    {`${rowData.shippingAddress.firstName} ${rowData.shippingAddress.lastName}`}
                  </div>
                )}
              />
              <Column 
                field="createdAt" 
                header="Order Date" 
                sortable 
                body={(rowData) => (
                  <span className="text-gray-600">
                    {new Date(rowData.createdAt).toLocaleDateString()}
                  </span>
                )}
              />
              <Column 
                field="total" 
                header="Total" 
                sortable 
                body={(rowData) => (
                  <span className="font-medium text-gray-900">
                    ₹{rowData.total.toFixed(2)}
                  </span>
                )}
              />
              <Column 
                field="orderStatus" 
                header="Status" 
                sortable 
                body={statusBodyTemplate}
              />
              <Column 
                header="Actions" 
                body={actionsBodyTemplate}
                style={{ width: '200px' }}
                frozen
                alignFrozen="right"
              />
            </DataTable>
          )}
        </div>

        <Dialog
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          header="Order Details"
          modal
          style={{ width: '90%', maxWidth: '800px' }}
          className="p-fluid"
        >
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {statusConfig[selectedOrder.orderStatus].icon}
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedOrder.orderStatus].bgColor} ${statusConfig[selectedOrder.orderStatus].color}`}>
                    {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                  </span>
                </div>
                <span className="text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Order Items</h3>
                </div>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            loading="lazy"
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
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-semibold text-lg text-gray-900">₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                    {selectedOrder.shippingAddress.address}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p>Method: {selectedOrder.paymentDetails.method}</p>
                    <p>Payment ID: {selectedOrder.paymentDetails.razorpay_payment_id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  )
}
