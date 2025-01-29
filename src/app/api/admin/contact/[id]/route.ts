import { NextRequest } from 'next/server';
import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

// In Next.js route handlers, the params should be typed using the built-in types

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return Response.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: contact });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    
    const message = await Contact.findById(id);
    if (!message) {
      return Response.json(
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

    return Response.json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return Response.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}