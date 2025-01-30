import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

interface Params {
  params: {
    id: string
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    await connectDB();
    const id = params.id;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return Response.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: contact });
  } catch (error: unknown) {
    console.log("Error deleting contact:", error); // Use the `error` variable
    return Response.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  const { params } = context;

  try {
    await connectDB();
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
