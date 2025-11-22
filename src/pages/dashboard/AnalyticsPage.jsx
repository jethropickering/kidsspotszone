import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTrendingUp, FiEye, FiHeart, FiStar, FiUsers, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalFavorites: 0,
    totalReviews: 0,
    averageRating: 0,
    venueStats: [],
    recentActivity: [],
    topPerformingVenues: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Get all venues for this owner
      const { data: venues } = await supabase
        .from('venues')
        .select('*')
        .eq('owner_id', user.id);

      if (!venues || venues.length === 0) {
        setLoading(false);
        return;
      }

      const venueIds = venues.map(v => v.id);

      // Get favorites count
      const { data: favorites } = await supabase
        .from('favorites')
        .select('id, created_at, venue_id')
        .in('venue_id', venueIds);

      // Get reviews with ratings
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id, rating, created_at, venue_id')
        .in('venue_id', venueIds);

      // Calculate stats
      const totalFavorites = favorites?.length || 0;
      const totalReviews = reviews?.length || 0;
      const averageRating = reviews?.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

      // Venue-specific stats
      const venueStats = venues.map(venue => {
        const venueFavorites = favorites?.filter(f => f.venue_id === venue.id).length || 0;
        const venueReviews = reviews?.filter(r => r.venue_id === venue.id) || [];
        const venueAvgRating = venueReviews.length
          ? (venueReviews.reduce((sum, r) => sum + r.rating, 0) / venueReviews.length).toFixed(1)
          : 0;

        return {
          id: venue.id,
          name: venue.name,
          slug: venue.slug,
          favorites: venueFavorites,
          reviews: venueReviews.length,
          rating: venueAvgRating,
          views: Math.floor(Math.random() * 500) + 100 // Simulated - would come from analytics table
        };
      });

      // Sort by performance (combination of views, favorites, reviews)
      const topPerformingVenues = [...venueStats]
        .sort((a, b) => (b.views + b.favorites * 10 + b.reviews * 5) - (a.views + a.favorites * 10 + a.reviews * 5))
        .slice(0, 5);

      // Recent activity (last 10 favorites and reviews)
      const recentFavorites = favorites?.slice(-5).map(f => ({
        type: 'favorite',
        date: f.created_at,
        venueId: f.venue_id,
        venueName: venues.find(v => v.id === f.venue_id)?.name
      })) || [];

      const recentReviews = reviews?.slice(-5).map(r => ({
        type: 'review',
        date: r.created_at,
        venueId: r.venue_id,
        venueName: venues.find(v => v.id === r.venue_id)?.name,
        rating: r.rating
      })) || [];

      const recentActivity = [...recentFavorites, ...recentReviews]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

      setAnalytics({
        totalViews: venueStats.reduce((sum, v) => sum + v.views, 0),
        totalFavorites,
        totalReviews,
        averageRating,
        venueStats,
        topPerformingVenues,
        recentActivity
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics | Kids Sports Zone</title>
        <meta name="description" content="View analytics and insights for your venues" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-500 to-primary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Analytics & Insights
            </h1>
            <p className="text-white/90">
              Track your venue performance and engagement
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Time Range Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex gap-2">
              {['7', '30', '90', '365'].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === days
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {days === '7' ? 'Last 7 days' : days === '30' ? 'Last 30 days' : days === '90' ? 'Last 90 days' : 'Last year'}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <FiEye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Views</div>
              <div className="text-xs text-green-600 mt-1">Simulated data</div>
            </div>

            <div className="card text-center">
              <FiHeart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{analytics.totalFavorites}</div>
              <div className="text-sm text-gray-600">Total Favorites</div>
            </div>

            <div className="card text-center">
              <FiStar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{analytics.totalReviews}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>

            <div className="card text-center">
              <FiTrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{analytics.averageRating}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Performing Venues */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold mb-6">Top Performing Venues</h2>

                {analytics.topPerformingVenues.length === 0 ? (
                  <div className="text-center py-12">
                    <FiTrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No venue data yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.topPerformingVenues.map((venue, index) => (
                      <div key={venue.id} className="flex items-center gap-4 p-4 bg-warm-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <FiEye className="w-4 h-4" />
                              {venue.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <FiHeart className="w-4 h-4" />
                              {venue.favorites} favorites
                            </span>
                            <span className="flex items-center gap-1">
                              <FiStar className="w-4 h-4" />
                              {venue.rating} ({venue.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Venues Performance */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold mb-6">All Venues Performance</h2>

                {analytics.venueStats.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No venues yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Venue</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Favorites</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Reviews</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.venueStats.map(venue => (
                          <tr key={venue.id} className="border-b border-gray-100 hover:bg-warm-50">
                            <td className="py-3 px-4">
                              <a href={`/venue/${venue.slug}`} className="text-primary-600 hover:text-primary-700 font-medium">
                                {venue.name}
                              </a>
                            </td>
                            <td className="text-center py-3 px-4 text-sm text-gray-600">{venue.views}</td>
                            <td className="text-center py-3 px-4 text-sm text-gray-600">{venue.favorites}</td>
                            <td className="text-center py-3 px-4 text-sm text-gray-600">{venue.reviews}</td>
                            <td className="text-center py-3 px-4">
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                                <FiStar className="w-4 h-4 text-yellow-500" />
                                {venue.rating || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Recent Activity</h3>

                {analytics.recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-warm-50 rounded-lg">
                        {activity.type === 'favorite' ? (
                          <FiHeart className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                        ) : (
                          <FiStar className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {activity.type === 'favorite' ? 'New favorite' : `New ${activity.rating}★ review`}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{activity.venueName}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Insights */}
              <div className="card bg-blue-50 border-2 border-blue-200">
                <h3 className="font-display font-semibold text-lg mb-3">💡 Insights</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Views are simulated - real tracking coming soon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Add high-quality photos to increase engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Respond to reviews to build trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Create offers to attract more visitors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
