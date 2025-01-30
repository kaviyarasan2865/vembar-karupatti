import Contact from '@/models/contact';
import connectDB from '@/lib/mongodb';

export async function DELETE(request, { params }) {
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
    console.log(error);
    return Response.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, context) {
  const { params } = context;

  try {
    await connectDB();
    const { id } = await params;
    const updatedMessage = await Contact.findByIdAndUpdate(
      id,
      { isViewed: true },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return Response.json({ error: 'Message not found' }, { status: 404 });
    }

    return Response.json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    return Response.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
