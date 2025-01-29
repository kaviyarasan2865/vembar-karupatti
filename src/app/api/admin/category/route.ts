import { NextResponse } from "next/server";
import Category from "@/models/Category";
import connectDB from "@/lib/mongodb";

export const GET = async () => {
    try {
        await connectDB();
        const categories = await Category.find({});
        return NextResponse.json(categories);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
      await connectDB();
  
      const { name, description, image } = await req.json();
  
      // Validate required fields
      if (!name || !description || !image) {
        return NextResponse.json(
          { error: 'All fields (name, description, image) are required' },
          { status: 400 }
        );
      }
  
      // Validate base64 image format
      if (!image.startsWith('data:image')) {
        return NextResponse.json(
          { error: 'Invalid image format. Must be base64' },
          { status: 400 }
        );
      }
  
      // Save category to the database
      const category = await Category.create({
        name,
        description,
        image,
      });
  
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }
  };

export const DELETE = async (req: Request) => {
    try {
        await connectDB();
        const { id } = await req.json();
        const category = await Category.findByIdAndDelete(id);
        
        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}

export const PUT = async (req: Request) => {
    try {
        await connectDB();
        const { id, name, description, image } = await req.json();
        
        // Validate base64 image if it's being updated
        if (image && !image.startsWith('data:image')) {
            return NextResponse.json(
                { error: "Invalid image format. Must be base64" },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description, image },
            { new: true }
        );

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}