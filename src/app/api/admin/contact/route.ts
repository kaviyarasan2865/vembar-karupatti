import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/contact";

export const GET = async() =>{
    try {
        await connectDB();
        const contacts = await Contact.find({});
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
    }
}

export const DELETE = async() =>{
    try {
        await connectDB();
        const contacts = await Contact.deleteMany({});
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete contacts" }, { status: 500 });
    }
}