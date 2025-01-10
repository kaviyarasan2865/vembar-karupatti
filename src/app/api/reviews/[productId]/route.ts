import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/review';
import Order from '@/models/Order';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    // Fetch all reviews for the product
    const reviews = await Review.find({ productId: params.productId })
      .populate('userId', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    let userHasReviewed = false;

    if (session?.user?.id) {
      // Check if user has already reviewed
      const existingReview = await Review.findOne({
        productId: params.productId,
        userId: session.user.id
      });

      // Check if user has purchased the product
      const order = await Order.findOne({
        userId: session.user.id,
        'items.productId': params.productId,
        orderStatus: 'delivered'
      });

      // Set verified status for each review
      const reviewsWithVerification = reviews.map(review => ({
        ...review,
        verified: Boolean(order && order.items.some(item => 
          item.productId.toString() === params.productId
        ))
      }));

      userHasReviewed = Boolean(existingReview);

      return NextResponse.json({
        reviews: reviewsWithVerification,
        userHasReviewed
      });
    }

    return NextResponse.json({
      reviews,
      userHasReviewed
    });

  } catch (error) {
    console.error('Error in GET reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 