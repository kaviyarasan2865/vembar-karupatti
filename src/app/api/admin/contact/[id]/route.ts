import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();
    const { id } = params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _req: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();
    const { id } = context.params;
    
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

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message', details: error },
      { status: 500 }
    );
  }
}