import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product"; // Add this import
import mongoose, { Types } from "mongoose";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, unitIndex, quantity } = body;

    // Validate request data
    if (!productId || typeof unitIndex !== 'number' || typeof quantity !== 'number') {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Find the cart and populate product details
    const cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item: { productId: Types.ObjectId; unitIndex: number }) => 
        item.productId.toString() === productId && 
        item.unitIndex === unitIndex
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Verify the product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product || !product.units[unitIndex] || product.units[unitIndex].stock < quantity) {
      return NextResponse.json(
        { error: "Invalid product or insufficient stock" },
        { status: 400 }
      );
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    // Prepare the response with full item details
    const cartItems = await Promise.all(cart.items.map(async (item: { productId: Types.ObjectId; unitIndex: number; quantity: number }) => {
      const product = await Product.findById(item.productId);
      return {
        productId: item.productId.toString(),
        unitIndex: item.unitIndex,
        quantity: item.quantity,
        name: product.name,
        image: product.image,
        price: product.units[item.unitIndex].price,
        stock: product.units[item.unitIndex].stock
      };
    }));

    return NextResponse.json({
      message: "Quantity updated successfully",
      items: cartItems
    }, { status: 200 });

  } catch (error) {
    console.error("Update cart error:", error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}