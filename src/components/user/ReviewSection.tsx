'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Star, ImagePlus, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    image: string;
  };
  productId: string;
  rating: number;
  feedback: string;
  images: string[];
  createdAt: string;
  verified: boolean;
}

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/review/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data.reviews);
      setUserHasReviewed(data.userHasReviewed);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setLoading(false);
    }
  }, [productId]);
  useEffect(() => {
    fetchReviews();
  }, [productId, fetchReviews]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 5);
    const imageUrls = newImages.map(file => URL.createObjectURL(file));

    setImages(prev => [...prev, ...newImages].slice(0, 5));
    setImagePreviewUrls(prev => [...prev, ...imageUrls].slice(0, 5));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please login to submit a review');
      return;
    }

    if (userHasReviewed) {
      toast.error('You have already reviewed this product');
      return;
    }

    if (!rating || !feedback) {
      toast.error('Please provide both rating and feedback');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('rating', rating.toString());
    formData.append('feedback', feedback);
    
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      // Clean up preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form
      setRating(5);
      setFeedback('');
      setImages([]);
      setImagePreviewUrls([]);
      
      toast.success('Review submitted successfully');
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {session && !userHasReviewed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-6 border rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                {/* Rating Stars */}
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setRating(star)}
                      className={`${
                        rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      } transition-colors duration-200`}
                    >
                      <Star className="w-7 h-7" />
                    </motion.button>
                  ))}
                </div>

                {/* Feedback Input */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={4}
                />

                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="cursor-pointer group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={images.length >= 5}
                      />
                      <div className="flex items-center space-x-2 text-amber-600 group-hover:text-amber-700">
                        <ImagePlus className="w-5 h-5" />
                        <span>Add Photos (Max 5)</span>
                      </div>
                    </label>
                    <span className="text-sm text-gray-500">
                      {images.length}/5
                    </span>
                  </div>

                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {imagePreviewUrls.map((url, index) => (
                        <motion.div
                          key={url}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative"
                        >
                          <Image
                            src={url}
                            alt={`Review image preview ${index + 1}`}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Submit Review'
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Reviews Summary */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                {reviews.length > 0
                  ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <Image
                      src={review.userId.image || 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'}
                      alt={review.userId.name || 'Anonymous'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.userId.name}</p>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.feedback}</p>

                  {review.images?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {review.images.map((image, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="relative rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`Review image by ${review.userId.name} - ${index + 1}`}
                            width={120}
                            height={120}
                            className="object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewSection;