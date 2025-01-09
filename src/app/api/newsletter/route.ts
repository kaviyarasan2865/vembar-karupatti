import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export const POST = async (req: Request) => {
  try {
    await connectDB();
    const { email } = await req.json();
    
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Invalid email address provided." },
        { status: 400 }
      );
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();

    return NextResponse.json(
      { message: "Successfully subscribed to newsletter!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in newsletter subscription:", error);

    // Check for duplicate key error (code 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This email is already subscribed to our newsletter." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
};
