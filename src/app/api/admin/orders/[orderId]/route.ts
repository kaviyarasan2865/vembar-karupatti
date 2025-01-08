import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get admin token from cookies
    const adminToken = request.cookies.get('admin_token')
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin token
    try {
      await jwtVerify(
        adminToken.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      )
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    await connectDB()
    const order = await Order.findByIdAndUpdate(
      params.orderId,
      { orderStatus: status },
      { new: true }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
} 