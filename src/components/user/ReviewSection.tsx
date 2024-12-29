'use client'
import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import Image from 'next/image';

interface RatingDistribution {
  rating: number;
  count: string;
}

interface CategoryRating {
  category: string;
  score: number;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

interface ReviewSectionProps {
  overallRating?: number;
  totalReviews?: number;
  ratingDistribution?: RatingDistribution[];
  categoryRatings?: CategoryRating[];
  reviews?: Review[];
}

const dummyData = {
  overallRating: 4.0,
  totalReviews: 35000,
  ratingDistribution: [
    { rating: 5, count: "14K" },
    { rating: 4, count: "6K" },
    { rating: 3, count: "4K" },
    { rating: 2, count: "800" },
    { rating: 1, count: "9K" }
  ],
  categoryRatings: [
    { category: "Cleanliness", score: 4.0 },
    { category: "Safety & Security", score: 4.0 },
    { category: "Staff", score: 4.0 },
    { category: "Amenities", score: 3.5 },
    { category: "Location", score: 3.0 }
  ],
  reviews: [
    {
      id: "1",
      author: "Alexander Rity",
      rating: 5.0,
      date: "4 months ago",
      comment: "Easy booking, great value! Cozy rooms at a reasonable price in Sheffield's vibrant center. Surprisingly quiet with nearby Traveller's accommodations. Highly recommended!",
      images: ["/api/placeholder/200/200", "/api/placeholder/200/200", "/api/placeholder/200/200"]
    },
    {
      id: "2",
      author: "Emma Crieght",
      rating: 4.0,
      date: "4 months ago",
      comment: "Effortless booking, unbeatable affordability! Small yet comfortable rooms in the heart of Sheffield's nightlife hub. Surrounded by elegant housing, it's a peaceful gem. Thumbs up!"
    },
    {
      id: "3",
      author: "Michael Chen",
      rating: 4.5,
      date: "2 months ago",
      comment: "Perfect location for business travelers. Clean rooms, efficient staff, and great amenities. The breakfast selection was impressive. Will definitely return on my next trip.",
      images: ["/api/placeholder/200/200"]
    },
    {
      id: "4",
      author: "Sarah Williams",
      rating: 3.5,
      date: "1 month ago",
      comment: "Decent stay overall. The room was clean and comfortable, though a bit small. Great location for exploring the city. Staff was helpful when needed."
    },
    {
      id: "5",
      author: "James Patterson",
      rating: 5.0,
      date: "2 weeks ago",
      comment: "Outstanding experience from check-in to check-out! The staff went above and beyond to make our stay comfortable. The room service was prompt and the food was delicious.",
      images: ["/api/placeholder/200/200", "/api/placeholder/200/200"]
    }
  ]
};

const ReviewSection = ({
  overallRating = dummyData.overallRating,
  totalReviews = dummyData.totalReviews,
  ratingDistribution = dummyData.ratingDistribution,
  categoryRatings = dummyData.categoryRatings,
  reviews = dummyData.reviews
}: ReviewSectionProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={`star-${i}`}
            className="w-4 h-4 text-[#FCD34D] fill-[#FCD34D]"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={`star-${i}`}
            className="w-4 h-4 text-[#FCD34D] fill-[#FCD34D]"
          />
        );
      } else {
        stars.push(
          <Star
            key={`star-${i}`}
            className="w-4 h-4 text-gray-300"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Individual Reviews - Left Column */}
        <div className="md:w-2/3 space-y-6">
          {visibleReviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-[#78350F] font-semibold">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{review.author}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
              {review.images && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {review.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      width={80}
                      height={80}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          {reviews.length > 4 && (
            <button 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-6 text-[#78350F] font-semibold hover:text-orange-500"
            >
              {showAllReviews ? 'Show less' : 'Read all reviews'}
            </button>
          )}
        </div>

        {/* Rating Summary - Right Column */}
        <div className="md:w-1/3">
          <div className="top-1">
            <div className="flex flex-col items-center mb-6">
              <div className="text-4xl font-bold">{overallRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 my-2">
                {renderStars(overallRating)}
              </div>
              <div className="text-sm text-gray-600">{totalReviews.toLocaleString()} ratings</div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-12 text-sm">{rating}.0</span>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#78350F] rounded-full"
                      style={{
                        width: `${(parseInt(count.replace(/[^\d]/g, '')) / totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-20 text-sm text-gray-600">{count} reviews</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;