'use client'
import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

interface Order {
  id: string
  customerName: string
  orderDate: string
  total: number
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  items: string[]
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const toast = useRef<Toast>(null)

  useEffect(() => {
    // Replace this with your actual API call
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    // Implement your API call here
    // For now using dummy data
    const dummyOrders = [
      {
        id: '1',
        customerName: 'John Doe',
        orderDate: '2024-03-20',
        total: 299.99,
        status: 'pending',
        items: ['Product 1', 'Product 2']
      },
      // Add more dummy orders as needed
    ]
    setOrders(dummyOrders)
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Implement your API call here
      // For now, just updating the state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      toast.current?.show({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Order ${orderId} has been ${newStatus}`,
        life: 3000
      })
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update order status',
        life: 3000
      })
    }
  }

  const statusBodyTemplate = (rowData: Order) => {
    const getStatusColor = (status: Order['status']) => {
      const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-blue-100 text-blue-800',
        rejected: 'bg-red-100 text-red-800',
        completed: 'bg-green-100 text-green-800'
      }
      return colors[status]
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rowData.status)}`}>
        {rowData.status}
      </span>
    )
  }

  const actionsBodyTemplate = (rowData: Order) => {
    return (
      <div className="flex gap-2">
        {rowData.status === 'pending' && (
          <>
            <Button
              severity="success"
              size="small"
              onClick={() => updateOrderStatus(rowData.id, 'accepted')}
            >
              Accept
            </Button>
            <Button
              severity="danger"
              size="small"
              onClick={() => updateOrderStatus(rowData.id, 'rejected')}
            >
              Reject
            </Button>
          </>
        )}
        {rowData.status === 'accepted' && (
          <Button
            severity="success"
            size="small"
            onClick={() => updateOrderStatus(rowData.id, 'completed')}
          >
            Mark Complete
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-600">Manage and update order statuses</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          value={orders}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          stripedRows
        >
          <Column field="id" header="Order ID" sortable />
          <Column field="customerName" header="Customer" sortable />
          <Column field="orderDate" header="Order Date" sortable />
          <Column 
            field="total" 
            header="Total" 
            sortable 
            body={(rowData) => `$${rowData.total.toFixed(2)}`}
          />
          <Column 
            field="status" 
            header="Status" 
            sortable 
            body={statusBodyTemplate}
          />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate}
            style={{ width: '200px' }}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default OrdersPage