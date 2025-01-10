'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/user/Navbar';
import Footer from '@/components/user/Footer';
import { Star, ImagePlus, X, Package, Calendar, Truck, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface ExistingReview {
  _id: string;
  rating: number;
  feedback: string;
  images: string[];
  createdAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  existingReview?: ExistingReview;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface Review {
  rating: number;
  feedback: string;
  images: File[];
  imagePreviewUrls: string[];
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
};

const statusColors = {
  pending: 'text-yellow-500',
  processing: 'text-blue-500',
  shipped: 'text-purple-500',
  delivered: 'text-green-500',
  cancelled: 'text-red-500',
};

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: Review }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();

      // Fetch existing reviews for each product
      const itemsWithReviews = await Promise.all(
        data.items.map(async (item: OrderItem) => {
          const reviewResponse = await fetch(`/api/reviews?productId=${item.productId}`);
          if (reviewResponse.ok) {
            const reviewData = await reviewResponse.json();
            return { ...item, existingReview: reviewData.review };
          }
          return item;
        })
      );

      setOrder({ ...data, items: itemsWithReviews });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string, productId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Refresh the order details to update the UI
      await fetchOrderDetails();
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleRatingChange = (productId: string, rating: number) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }));
  };

  const handleFeedbackChange = (productId: string, feedback: string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], feedback }
    }));
  };

  const handleImageUpload = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Convert FileList to Array and get only first 5 images
    const newImages = Array.from(files).slice(0, 5);
    
    // Create preview URLs for the images
    const imageUrls = newImages.map(file => URL.createObjectURL(file));

    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: [...(prev[productId]?.images || []), ...newImages].slice(0, 5),
        imagePreviewUrls: [...(prev[productId]?.imagePreviewUrls || []), ...imageUrls].slice(0, 5)
      }
    }));
  };

  const removeImage = (productId: string, index: number) => {
    setReviews(prev => {
      const review = prev[productId];
      if (!review) return prev;

      const newImages = [...review.images];
      const newPreviewUrls = [...review.imagePreviewUrls];
      
      // Remove image and its preview URL
      newImages.splice(index, 1);
      URL.revokeObjectURL(newPreviewUrls[index]); // Clean up the URL
      newPreviewUrls.splice(index, 1);

      return {
        ...prev,
        [productId]: {
          ...review,
          images: newImages,
          imagePreviewUrls: newPreviewUrls
        }
      };
    });
  };

  const submitReview = async (productId: string) => {
    try {
      const review = reviews[productId];
      if (!review?.rating || !review?.feedback) {
        alert('Please provide both rating and feedback');
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', review.rating.toString());
      formData.append('feedback', review.feedback);
      
      // Append images if they exist
      if (review.images && review.images.length > 0) {
        review.images.forEach(image => {
          formData.append('images', image);
        });
      }

      console.log('Submitting review:', {
        productId,
        rating: review.rating,
        feedback: review.feedback,
        imageCount: review.images?.length || 0
      });

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Clean up preview URLs
      review.imagePreviewUrls?.forEach(url => URL.revokeObjectURL(url));
      
      // Clear the review form
      setReviews(prev => {
        const newReviews = { ...prev };
        delete newReviews[productId];
        return newReviews;
      });

      alert('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit review');
    }
  };

  const downloadReceipt = async () => {
    try {
      // Show loading state
      const loadingToast = toast.loading('Generating receipt...');

      const response = await fetch(`/api/orders/receipt/${params.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        toast.dismiss(loadingToast);
        throw new Error('Failed to generate receipt');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Use file-saver to download
      saveAs(blob, `order-receipt-${params.id}.pdf`);
      
      // Show success message
      toast.dismiss(loadingToast);
      toast.success('Receipt downloaded successfully');

    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Package className="w-12 h-12 text-amber-600" />
            </motion.div>
            <p className="text-amber-600 font-medium">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 flex items-center space-x-2"
          >
            <AlertCircle className="w-6 h-6" />
            <span>Order not found</span>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const StatusIcon = statusIcons[order.orderStatus];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="border-b pb-6">
                <h1 className="text-3xl font-semibold mb-4 text-gray-800">Order Details</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-600">Order ID: <span className="font-medium">{order._id}</span></p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-600">
                      Placed on: <span className="font-medium">{format(new Date(order.createdAt), 'PPP')}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${statusColors[order.orderStatus]}`} />
                    <p className="text-gray-600">
                      Status: <span className={`font-semibold ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-6 border-b">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>

              <div className="py-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
                  {(order.orderStatus === 'delivered') && (
                    <button
                      onClick={downloadReceipt}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Receipt</span>
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-6">
                        {item.image && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                          <div className="flex space-x-6">
                            <p className="text-gray-600">
                              <span className="font-medium">Quantity:</span> {item.quantity}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Price:</span> ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {order.orderStatus === 'delivered' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 border-t pt-6"
                        >
                          {item.existingReview ? (
                            <div className="bg-gray-50 p-6 rounded-lg">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Your Review</h4>
                                <button
                                  onClick={() => deleteReview(item.existingReview._id, item.productId)}
                                  className="text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center space-x-1"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                              <div className="flex space-x-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= item.existingReview.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 mb-4">{item.existingReview.feedback}</p>
                              {item.existingReview.images?.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                  {item.existingReview.images.map((image, index) => (
                                    <motion.div
                                      key={index}
                                      whileHover={{ scale: 1.05 }}
                                      className="relative rounded-lg overflow-hidden"
                                    >
                                      <Image
                                        src={image}
                                        alt={`Review image ${index + 1}`}
                                        width={120}
                                        height={120}
                                        className="object-cover"
                                      />
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                              <p className="text-sm text-gray-500 mt-3">
                                Posted on: {format(new Date(item.existingReview.createdAt), 'PPP')}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-800">Write a Review</h4>
                              <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <motion.button
                                    key={star}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleRatingChange(item.productId, star)}
                                    className={`${
                                      (reviews[item.productId]?.rating || 0) >= star
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    } transition-colors duration-200`}
                                  >
                                    <Star className="w-7 h-7" />
                                  </motion.button>
                                ))}
                              </div>
                              <textarea
                                placeholder="Share your experience with this product..."
                                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow duration-200"
                                rows={4}
                                value={reviews[item.productId]?.feedback || ''}
                                onChange={(e) => handleFeedbackChange(item.productId, e.target.value)}
                              />

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="cursor-pointer group">
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleImageUpload(item.productId, e)}
                                      disabled={reviews[item.productId]?.images?.length >= 5}
                                    />
                                    <div className="flex items-center space-x-2 text-amber-600 group-hover:text-amber-700 transition-colors duration-200">
                                      <ImagePlus className="w-5 h-5" />
                                      <span>Add Photos (Max 5)</span>
                                    </div>
                                  </label>
                                  <span className="text-sm text-gray-500">
                                    {reviews[item.productId]?.images?.length || 0}/5
                                  </span>
                                </div>

                                {reviews[item.productId]?.imagePreviewUrls?.length > 0 && (
                                  <div className="flex flex-wrap gap-3">
                                    {reviews[item.productId].imagePreviewUrls.map((url, index) => (
                                      <motion.div
                                        key={url}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative"
                                      >
                                        <Image
                                          src={url}
                                          alt={`Preview ${index + 1}`}
                                          width={120}
                                          height={120}
                                          className="rounded-lg object-cover"
                                        />
                                        <button
                                          onClick={() => removeImage(item.productId, index)}
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => submitReview(item.productId)}
                                className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                              >
                                <Star className="w-5 h-5" />
                                <span>Submit Review</span>
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-end">
                    <div className="w-full max-w-md">
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t pt-2">
                          <span>Total</span>
                          <span>₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}