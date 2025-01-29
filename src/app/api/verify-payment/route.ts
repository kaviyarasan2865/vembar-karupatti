import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
// import { ObjectId } from "mongodb";


interface CartItem {
  productId: string;
  unitIndex: number;
  quantity: number;
  name: string;
  price: number;
  stock: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await request.json();

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    const isAuthentic = signature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();

    // Verify stock availability before proceeding
    for (const item of orderData.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.units[item.unitIndex].stock < item.quantity) {
        return NextResponse.json(
          { error: "Some items are out of stock" },
          { status: 400 }
        );
      }
    }

    // Create order in database
    const order = await Order.create({
      userId: session.user.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentDetails: {
        method: "online",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      orderStatus: "pending",
    });

    // Update stock levels using mongoose
    const updatePromises = orderData.items.map(async (item: CartItem) => {
      return Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            [`units.${item.unitIndex}.stock`]: -item.quantity,
          },
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    // Clear the cart
    await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { items: [] } }
    );

    return NextResponse.json({
      success: true,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
