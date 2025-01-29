import { NextResponse } from 'next/server';
import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    
    console.log('Updating message ID:', id); // Debug log

    // Find the message first to verify it exists
    const message = await Contact.findById(id);
    if (!message) {
      console.log('Message not found:', id); // Debug log
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Update the message
    const updatedMessage = await Contact.findByIdAndUpdate(
      id,
      { isViewed: true }, // Explicitly set to true
      { 
        new: true,
        runValidators: true // Ensure the update follows schema validation
      }
    );

    console.log('Updated message:', updatedMessage); // Debug log

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}