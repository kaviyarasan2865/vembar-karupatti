import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; 
import Product from "@/models/Product"; 

// GET all products
export const GET = async () => {
  try {
    await connectDB();
    const products = await Product.find(); // Fetch all products from the database
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }  
};
