import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

// In Next.js route handlers, the params should be typed using the built-in types



export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = params;
    
    const message = await Contact.findById(id);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const updatedMessage = await Contact.findByIdAndUpdate(
      id,
      { isViewed: true },
      { 
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}