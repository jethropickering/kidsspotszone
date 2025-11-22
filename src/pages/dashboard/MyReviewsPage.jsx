import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiStar, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';

export default function MyReviewsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadMyReviews();
  }, []);

  const loadMyReviews = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { data } = await supabase
        .from('reviews')
        .select('*, venue:venues(name, slug)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== reviewId));
      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <LoadingSpinner text="Loading your reviews..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Reviews | Kids Sports Zone</title>
        <meta name="description" content="View and manage your reviews" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              My Reviews
            </h1>
            <p className="text-white/90">
              Manage all the reviews you've written
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Review Stats */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Your Stats</h3>

                <div className="text-center mb-4">
                  <div className="text-4xl font-display font-bold text-gray-900">{reviews.length}</div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>

                {reviews.length > 0 && (
                  <>
                    <div className="text-center mb-4 pt-4 border-t border-gray-200">
                      <div className="text-3xl font-display font-bold text-gray-900">{averageRating}</div>
                      <StarRating rating={parseFloat(averageRating)} size="md" />
                      <p className="text-sm text-gray-600 mt-1">Average Rating</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Rating breakdown:</p>
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map(rating => {
                          const count = reviews.filter(r => r.rating === rating).length;
                          return (
                            <div key={rating} className="flex items-center gap-2 text-sm">
                              <span className="text-gray-700">{rating}★</span>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400"
                                  style={{ width: `${(count / reviews.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-gray-600 w-6 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Tips */}
              <div className="card bg-blue-50 border-2 border-blue-200">
                <h3 className="font-display font-semibold text-lg mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Be specific about what you liked or didn't like</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Mention age-appropriate activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Include details about facilities and staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Your reviews help other parents make informed decisions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3">
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">
                    Your Reviews ({reviews.length})
                  </h2>
                  <Link to="/search" className="btn-primary text-sm">
                    Find Activities to Review
                  </Link>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-6">
                      Share your experiences to help other parents
                    </p>
                    <Link to="/search" className="btn-primary">
                      Find Activities to Review
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link
                              to={`/venue/${review.venue?.slug}`}
                              className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                            >
                              {review.venue?.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">{formatDate(review.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                        </div>

                        {review.title && (
                          <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                        )}

                        <p className="text-gray-700 mb-4">{review.comment}</p>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <button
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600"
                            onClick={() => alert('Edit functionality coming soon')}
                          >
                            <FiEdit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
                            onClick={() => handleDelete(review.id)}
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
