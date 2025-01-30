import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import jsPDF from 'jspdf';

export async function GET(
  context
) {
  try {
    const { id } = context.params;
    console.log('Processing receipt for order:', id);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findOne({
      _id: id,
      userId: session.user.id
    }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Add content
    doc.setFontSize(20);
    doc.text('ORDER RECEIPT', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);

    // Shipping Address
    doc.text('Shipping Address:', 20, 70);
    doc.text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 20, 80);
    doc.text(order.shippingAddress.address, 20, 90);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 20, 100);

    // Order Items
    doc.text('Order Items:', 20, 120);
    let yPos = 130;
    order.items.forEach(item => {
      doc.text(`• ${item.name}`, 20, yPos);
      doc.text(`Quantity: ${item.quantity}`, 30, yPos + 5);
      doc.text(`Price: ₹${item.price.toLocaleString()}`, 30, yPos + 10);
      yPos += 20;
    });

    // Order Summary
    yPos += 10;
    doc.text('Order Summary:', 20, yPos);
    doc.text(`Subtotal: ₹${order.total.toLocaleString()}`, 20, yPos + 10);
    doc.text('Shipping: Free', 20, yPos + 20);
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${order.total.toLocaleString()}`, 20, yPos + 35);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for shopping with us!', 105, 280, { align: 'center' });

    // Get PDF as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="order-receipt-${order._id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      },
    });

  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
} 