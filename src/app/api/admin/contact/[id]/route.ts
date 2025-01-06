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
      { error: 'Failed to update message', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 