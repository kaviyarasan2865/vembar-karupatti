import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

// DELETE a contact by ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectDB();

  try {
    const contact = await Contact.findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

// PATCH (mark a message as viewed)
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectDB();

  try {
    const updatedMessage = await Contact.findByIdAndUpdate(
      params.id,
      { isViewed: true },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
