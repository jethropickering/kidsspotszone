import { useState } from 'react';
import { db } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import StarRating from '../common/StarRating';

export default function ReviewForm({ venueId, onSuccess, onCancel }) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError('Please select a star rating');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('Please write at least 10 characters in your review');
      return;
    }

    setLoading(true);
    setError('');

    const reviewData = {
      venue_id: venueId,
      user_id: user.id,
      rating: formData.rating,
      title: formData.title.trim() || null,
      comment: formData.comment.trim()
    };

    const { error: submitError } = await db.createReview(reviewData);

    if (submitError) {
      setError('Failed to submit review. Please try again.');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-warm-50 border-2 border-primary-200">
      <h3 className="font-display font-semibold text-lg mb-4">Write a Review</h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={formData.rating}
          size="lg"
          showNumber={false}
          interactive={true}
          onChange={handleRatingChange}
        />
        {formData.rating > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {formData.rating === 1 && 'Poor'}
            {formData.rating === 2 && 'Fair'}
            {formData.rating === 3 && 'Good'}
            {formData.rating === 4 && 'Very Good'}
            {formData.rating === 5 && 'Excellent'}
          </p>
        )}
      </div>

      {/* Title (Optional) */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Great experience for my kids!"
          className="input-field"
          maxLength={100}
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your experience with other parents..."
          className="input-field resize-none"
          rows="5"
          required
          minLength={10}
          maxLength={1000}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Minimum 10 characters</span>
          <span>{formData.comment.length} / 1000</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-outline flex-1"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        By submitting a review, you agree to our review guidelines and terms of service.
      </p>
    </form>
  );
}
