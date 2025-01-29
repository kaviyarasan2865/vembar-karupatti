import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

//Get all categories

export const GET = async () => {
    try {
        await connectDB();
        const categories = await Category.find({});
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
};