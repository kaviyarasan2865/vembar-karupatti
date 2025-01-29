import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";

interface CartItem {
  productId: string;
  unitIndex: number;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  stock: number;
}

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

    if (!item.productId || !item.name || typeof item.unitIndex !== 'number' || !item.quantity) {
      return NextResponse.json(
        { error: "Invalid item data" },
        { status: 400 }
      );
    }

    await connectDB();
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
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
      const existingItem = cart.items.find(
        (i: CartItem) => i.productId.toString() === item.productId && i.unitIndex === item.unitIndex
      );

      if (existingItem) {
        return NextResponse.json(
          { error: "Item already exists in cart" },
          { status: 400 }
        );
      }

      const existingItemIndex = cart.items.findIndex(
        (i: CartItem) => i.productId === item.productId && i.unitIndex === item.unitIndex
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
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
  } catch (error: unknown) {
    console.error("POST cart error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, unitIndex } = await request.json();

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (i: CartItem) => i.productId === productId && i.unitIndex === unitIndex
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);

    try {
      await cart.save();
    } catch (saveError) {
      console.error("Cart save error:", saveError);
      throw new Error("Failed to save cart");
    }

    return NextResponse.json(cart.items, { status: 200 });
  } catch (error: unknown) {
    console.error("DELETE cart error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}