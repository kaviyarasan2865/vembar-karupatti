import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/review';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Parse the multipart form data
    const formData = await req.formData();
    
    // Validate required fields
    const productId = formData.get('productId');
    const rating = formData.get('rating');
    const feedback = formData.get('feedback');

    if (!productId || !rating || !feedback) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle multiple images
    const images: string[] = [];
    const imageFiles = formData.getAll('images');
    
    // Convert images to base64 strings
    for (const file of imageFiles) {
      if (file instanceof Blob) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
          images.push(base64Image);
        } catch (error) {
          console.error('Error processing image:', error);
          // Continue with other images if one fails
        }
      }
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: session.user.id,
      product: productId
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create and save the review
    const review = new Review({
      user: session.user.id,
      product: productId,
      rating: Number(rating),
      feedback,
      images,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await review.save();

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: {
        id: review._id,
        rating: review.rating,
        feedback: review.feedback,
        imagesCount: review.images.length
      }
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findOne({
      user: session.user.id,
      product: productId
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
} 