import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderData } = await req.json();
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

    // Create the order
    const order = await Order.create({
      userId: session.user.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      orderStatus: "pending",
      paymentMethod: "cod",
      paymentDetails: {
        method: "cod"
      },
      createdAt: new Date(),
    });

    // Update stock levels using mongoose
    const updatePromises = orderData.items.map(async (item: {
      productId: string;
      unitIndex: number;
      quantity: number;
    }) => {
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

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("Error creating COD order:", error);
    return NextResponse.json(
      { success: false, error: "Order creation failed" },
      { status: 500 }
    );
  }
}
