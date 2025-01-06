import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id });
    
    return NextResponse.json(cart?.items || [], { status: 200 });
  } catch (error) {
    console.error("GET cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const item = await request.json();
    
    // Validate item data
    if (!item.productId || !item.name || typeof item.unitIndex !== 'number' || !item.quantity) {
      return NextResponse.json(
        { error: "Invalid item data" },
        { status: 400 }
      );
    }

    await connectDB();

    let cart = await Cart.findOne({ userId: session.user.id });
    
    if (!cart) {
      // Create new cart if it doesn't exist
      try {
        cart = await Cart.create({
          userId: session.user.id,
          items: [item]
        });
      } catch (createError) {
        console.error("Cart creation error:", createError);
        throw new Error("Failed to create cart");
      }
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex(
        (i: any) => i.productId === item.productId && i.unitIndex === item.unitIndex
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cart.items.push(item);
      }

      try {
        await cart.save();
      } catch (saveError) {
        console.error("Cart save error:", saveError);
        throw new Error("Failed to save cart");
      }
    }

    return NextResponse.json(cart.items, { status: 200 });
  } catch (error) {
    console.error("POST cart error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add item to cart" },
      { status: 500 }
    );
  }
}  