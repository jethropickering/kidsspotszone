import { useState, useEffect } from 'react';
import { db } from '../../services/supabase';
import StarRating from '../common/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewList({ venueId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    loadReviews();
  }, [venueId]);

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await db.getVenueReviews(venueId);

    if (data) {
      setReviews(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner text="Loading reviews..." />;
  }

  if (reviews.length === 0) {
    return (
      <div className="card text-center py-12 bg-warm-50">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-lg font-display font-semibold mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this venue!</p>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const startIndex = (page - 1) * reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  return (
    <div className="space-y-4">
      {paginatedReviews.map((review) => (
        <div key={review.id} className="card">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0">
                {review.user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div>
                <div className="font-semibold text-gray-900">
                  {review.user?.full_name || 'Anonymous'}
                </div>
                <StarRating rating={review.rating} size="sm" showNumber={false} />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </div>
          </div>

          {review.title && (
            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
          )}

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {review.comment}
          </p>

          {/* Owner Response */}
          {review.owner_response && (
            <div className="mt-4 pl-4 border-l-4 border-primary-200 bg-warm-50 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-primary-700">Response from Owner</span>
                {review.owner_response_at && (
                  <span className="text-xs text-gray-500">
                    • {formatDistanceToNow(new Date(review.owner_response_at), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {review.owner_response}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  page === i + 1
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
