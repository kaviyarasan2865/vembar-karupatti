import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/review';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const rating = formData.get('rating') as string;
    const feedback = formData.get('feedback') as string;
    const imageFiles = formData.getAll('images') as File[];

    // Validate inputs
    if (!productId || !rating || !feedback) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      productId,
      userId: session.user.id
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary if present
    const imageUrls = [];
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await uploadToCloudinary(buffer);
        if (result?.secure_url) {
          imageUrls.push(result.secure_url);
        }
      }
    }

    // Create new review
    const review = new Review({
      userId: session.user.id,
      productId,
      rating: Number(rating),
      feedback,
      images: imageUrls,
      createdAt: new Date()
    });

    await review.save();

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: {
        _id: review._id,
        rating: review.rating,
        feedback: review.feedback,
        images: review.images
      }
    });

  } catch (error) {
    console.error('Error in POST review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
} 