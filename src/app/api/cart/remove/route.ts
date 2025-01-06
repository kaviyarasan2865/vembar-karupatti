  import { NextRequest, NextResponse } from "next/server";
  import { getServerSession } from "next-auth/next";
  import { authOptions } from "../../auth/[...nextauth]/auth";
  import connectDB from "@/lib/mongodb";
  import Cart from "@/models/Cart";

  connectDB();

  export async function DELETE(request: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        console.log("Unauthorized request");
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const { productId, unitIndex } = await request.json();
      console.log("Attempting to remove item:", { productId, unitIndex });
  
      if (!productId || typeof unitIndex !== 'number') {
        console.log("Invalid request data:", { productId, unitIndex });
        return NextResponse.json(
          { error: "Invalid request data" },
          { status: 400 }
        );
      }
  
      await connectDB();
  
      const cart = await Cart.findOne({ userId: session.user.id });
      
      if (!cart) {
        console.log("Cart not found for user:", session.user.id);
        return NextResponse.json(
          { error: "Cart not found" },
          { status: 404 }
        );
      }
  
      // Log the items before removal
      console.log("Current cart items:", cart.items);
  
      const initialLength = cart.items.length;
      cart.items = cart.items.filter((item: any) => {
        const keepItem = !(item.productId.toString() === productId && item.unitIndex === unitIndex);
        return keepItem;
      });
  
      // Verify removal worked
      if (cart.items.length === initialLength) {
        console.log("No items were removed. Item may not exist:", { productId, unitIndex });
        return NextResponse.json(
          { error: "Item not found in cart" },
          { status: 404 }
        );
      }
  
      await cart.save();
      console.log("Successfully removed item. Updated cart items:", cart.items);
  
      return NextResponse.json(cart.items, { status: 200 });
    } catch (error) {
      console.error("Remove from cart error:", error);
      return NextResponse.json(
        { error: "Failed to remove item from cart" },
        { status: 500 }
      );
    }
  }