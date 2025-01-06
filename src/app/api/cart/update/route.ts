import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import mongoose from "mongoose";

export async function PUT(request: NextRequest) {
  try {
    // 1. Ensure database connection
    await connectDB();

    // 2. Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const { productId, unitIndex, quantity, amount } = body;

    console.log("Received update request:", { productId, unitIndex, quantity, amount });

    if (!productId || typeof unitIndex !== 'number' || typeof quantity !== 'number' || typeof amount !== 'number') {
      console.log("Invalid request data:", body);
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // 4. Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // 5. Find and update cart using findOneAndUpdate
    const updatedCart = await Cart.findOneAndUpdate(
      { 
        userId: session.user.id,
        'items.productId': productId,
        'items.unitIndex': unitIndex
      },
      {
        $set: {
          'items.$.quantity': quantity,
          'items.$.amount': amount
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      console.log("Cart not found for user:", session.user.id);
      return NextResponse.json(
        { error: "Cart or item not found" },
        { status: 404 }
      );
    }

    // 6. Return updated items
    console.log("Cart updated successfully:", updatedCart.items);
    return NextResponse.json({
      message: "Cart updated successfully",
      items: updatedCart.items
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