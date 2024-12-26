import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import  connectDB  from "@/lib/mongodb";

// GET all products
export const GET = async () => {
    try {
      await connectDB();
      // Fetch all products from the database
      const products = await Product.find();
      return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
    }
  };

// POST new product
export const POST = async (req: Request) => {
    try {
      await connectDB();
  
      const formData = await req.formData();
      const name = formData.get('name')?.toString();
      const description = formData.get('description')?.toString();
      const category = formData.get('category')?.toString();
      const isActive = formData.get('isActive') === 'true';
      const units = JSON.parse(formData.get('units')?.toString() || '[]');
      const image = formData.get('image');
      const image2 = formData.get('image2');
      const image3 = formData.get('image3');
  
      // Convert images to Base64
      const images = await Promise.all(
        [image, image2, image3].map(async (file) => {
          if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            return `data:${file.type};base64,${buffer.toString('base64')}`;
          }
          return null;
        })
      );
  
      const [base64Image, base64Image2, base64Image3] = images;
  
      // Validate required fields
      if (!name || !description || !category || units.length === 0 || !base64Image) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
      }
  
      // Save to database
      const product = new Product({
        name,
        description,
        category,
        isActive,
        units,
        image: base64Image,
        image2: base64Image2,
        image3: base64Image3,
      });
  
      await product.save();
  
      return new Response(JSON.stringify({ success: true, product }), { status: 201 });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  };
  
  
// PUT/UPDATE product
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, name, description, category, units, image, image2, image3, isActive } = await req.json();

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Validate base64 images if they're being updated
    if (image && !image.startsWith('data:image')) {
      return NextResponse.json(
        { error: "Invalid main image format. Must be base64" },
        { status: 400 }
      );
    }

    if (image2 && !image2.startsWith('data:image')) {
      return NextResponse.json(
        { error: "Invalid image2 format. Must be base64" },
        { status: 400 }
      );
    }

    if (image3 && !image3.startsWith('data:image')) {
      return NextResponse.json(
        { error: "Invalid image3 format. Must be base64" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        units,
        image,
        image2,
        image3,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}