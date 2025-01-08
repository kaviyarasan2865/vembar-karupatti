import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
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
    const { productId, name, unitIndex, quantity, price, image, stock } = body;

    // Validate request data
    if (!productId || !name || typeof unitIndex !== 'number' || !quantity || !price) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      cart = await Cart.create({
        userId: session.user.id,
        items: [{
          productId,
          name,
          image: image || '',
          unitIndex,
          quantity,
          price,
          stock
        }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === productId && item.unitIndex === unitIndex
      );

      if (existingItemIndex > -1) {
        return NextResponse.json(
          { error: "Item already exists in the cart" },
          { status: 400 }
        );
      } else {
        cart.items.push({
          productId,
          name,
          image: image || '',
          unitIndex,
          quantity,
          price,
          stock
        });
      }

      await cart.save();
    }

    return NextResponse.json({
      message: "Item added to cart successfully",
      items: cart.items
    }, { status: 200 });

  } catch (error) {
    console.error("Add to cart error:", error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// Update GET handler to use userId instead of userEmail
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      return NextResponse.json([]);
    }

    return NextResponse.json(cart.items);
  } catch (error: any) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}