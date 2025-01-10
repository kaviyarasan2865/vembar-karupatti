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
    const { productId } = params;
    const session = await getServerSession(authOptions);
    await connectDB();

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    let userHasReviewed = false;

    if (session?.user?.id) {
      const existingReview = await Review.findOne({
        product: productId,
        user: session.user.id
      });

      const order = await Order.findOne({
        userId: session.user.id,
        'items.productId': productId,
        orderStatus: 'delivered'
      });

      userHasReviewed = Boolean(existingReview);
    }

    const reviewsWithVerification = await Promise.all(reviews.map(async review => {
      const order = await Order.findOne({
        userId: review.user._id,
        'items.productId': productId,
        orderStatus: 'delivered'
      });

      return {
        ...review,
        userId: review.user,
        verified: Boolean(order && order.items.some(item => 
          item.productId.toString() === productId
        ))
      };
    }));

    return NextResponse.json({
      reviews: reviewsWithVerification,
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