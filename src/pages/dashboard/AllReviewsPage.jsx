import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiStar, FiMessageCircle, FiFilter } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';

export default function AllReviewsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filter, setFilter] = useState('all'); // all, 5star, 4star, 3star, 2star, 1star
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, selectedVenue, reviews]);

  const loadReviews = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Get all venues owned by this user
      const { data: venuesData } = await supabase
        .from('venues')
        .select('id, name, slug')
        .eq('owner_id', user.id);

      if (!venuesData || venuesData.length === 0) {
        setLoading(false);
        return;
      }

      setVenues(venuesData);
      const venueIds = venuesData.map(v => v.id);

      // Get all reviews for these venues
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, venue:venues(name, slug), user:profiles(full_name)')
        .in('venue_id', venueIds)
        .order('created_at', { ascending: false });

      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    // Filter by rating
    if (filter !== 'all') {
      const rating = parseInt(filter.replace('star', ''));
      filtered = filtered.filter(r => r.rating === rating);
    }

    // Filter by venue
    if (selectedVenue !== 'all') {
      filtered = filtered.filter(r => r.venue_id === selectedVenue);
    }

    setFilteredReviews(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const distribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>All Reviews | Kids Sports Zone</title>
        <meta name="description" content="View and manage all reviews for your venues" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              All Reviews
            </h1>
            <p className="text-white/90">
              View and respond to reviews from parents
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              {/* Rating Summary */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Rating Summary</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-display font-bold text-gray-900">{averageRating}</div>
                  <StarRating rating={parseFloat(averageRating)} size="lg" />
                  <p className="text-sm text-gray-600 mt-1">{reviews.length} total reviews</p>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = distribution[rating];
                    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 w-12">{rating} star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <FiFilter className="w-5 h-5" />
                  Filters
                </h3>

                <div className="space-y-4">
                  {/* Filter by Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Rating
                    </label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5star">5 Stars</option>
                      <option value="4star">4 Stars</option>
                      <option value="3star">3 Stars</option>
                      <option value="2star">2 Stars</option>
                      <option value="1star">1 Star</option>
                    </select>
                  </div>

                  {/* Filter by Venue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Venue
                    </label>
                    <select
                      value={selectedVenue}
                      onChange={(e) => setSelectedVenue(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Venues</option>
                      {venues.map(venue => (
                        <option key={venue.id} value={venue.id}>{venue.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setFilter('all');
                      setSelectedVenue('all');
                    }}
                    className="btn-outline w-full text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3">
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">
                    Reviews ({filteredReviews.length})
                  </h2>
                </div>

                {filteredReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2">No reviews found</h3>
                    <p className="text-gray-600">
                      {reviews.length === 0
                        ? 'Reviews from parents will appear here'
                        : 'Try adjusting your filters'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredReviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">
                                {review.user?.full_name || 'Anonymous'}
                              </p>
                              <span className="text-gray-400">•</span>
                              <p className="text-sm text-gray-600">{formatDate(review.created_at)}</p>
                            </div>
                            <a
                              href={`/venue/${review.venue?.slug}`}
                              className="text-sm text-primary-600 hover:text-primary-700"
                            >
                              {review.venue?.name}
                            </a>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>

                        {review.title && (
                          <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                        )}

                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* Response Section (Coming Soon) */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                            <FiMessageCircle className="w-4 h-4" />
                            Respond to Review (Coming Soon)
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
