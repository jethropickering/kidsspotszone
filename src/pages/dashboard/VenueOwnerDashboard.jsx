import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiTag, FiStar, FiUsers, FiTrendingUp, FiSettings, FiPlus, FiEdit, FiEye, FiTrash2, FiCalendar } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { db, supabase } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';
import OfferForm from '../../components/offers/OfferForm';

export default function VenueOwnerDashboard() {
  const { user, profile, loading: authLoading, signOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [stats, setStats] = useState({
    totalVenues: 0,
    activeOffers: 0,
    totalReviews: 0,
    totalFavorites: 0
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [selectedVenueForOffer, setSelectedVenueForOffer] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Load venues owned by this user
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (venuesError) throw venuesError;

      setVenues(venuesData || []);

      // Load offers and reviews separately to calculate stats
      let totalOffers = 0;
      let totalReviews = 0;

      if (venuesData && venuesData.length > 0) {
        const venueIds = venuesData.map(v => v.id);

        const { data: offersData } = await supabase
          .from('offers')
          .select('id')
          .in('venue_id', venueIds);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('id')
          .in('venue_id', venueIds);

        totalOffers = offersData?.length || 0;
        totalReviews = reviewsData?.length || 0;
      }

      const totalFavorites = venuesData?.reduce((sum, v) => sum + (v.favorite_count || 0), 0) || 0;

      setStats({
        totalVenues: venuesData?.length || 0,
        activeOffers: totalOffers,
        totalReviews: totalReviews,
        totalFavorites: totalFavorites
      });

      // Load recent reviews for owned venues
      if (venuesData && venuesData.length > 0) {
        const venueIds = venuesData.map(v => v.id);

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, venue:venues(name), user:profiles(full_name)')
          .in('venue_id', venueIds)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentReviews(reviewsData || []);

        // Load all offers for owned venues
        const { data: offersData } = await supabase
          .from('offers')
          .select('*, venue:venues(name, slug)')
          .in('venue_id', venueIds)
          .order('created_at', { ascending: false });

        setAllOffers(offersData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleCreateOffer = (venue) => {
    setSelectedVenueForOffer(venue);
    setEditingOffer(null);
    setShowOfferForm(true);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setSelectedVenueForOffer(venues.find(v => v.id === offer.venue_id));
    setShowOfferForm(true);
  };

  const handleDeleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const { error } = await db.deleteOffer(offerId);
      if (error) throw error;

      setAllOffers(allOffers.filter(o => o.id !== offerId));
      alert('Offer deleted successfully!');
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Failed to delete offer. Please try again.');
    }
  };

  const handleOfferFormSuccess = () => {
    setShowOfferForm(false);
    setSelectedVenueForOffer(null);
    setEditingOffer(null);
    loadDashboardData(); // Reload data
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Venue Owner Dashboard | Kids Sports Zone</title>
        <meta name="description" content="Manage your venue listings and offers" />
      </Helmet>

      <div className="bg-warm-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Venue Owner Dashboard
            </h1>
            <p className="text-white/90">
              Welcome, {profile?.full_name || user?.email}
            </p>
          </div>
        </div>

        <div className="section-container py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <FiHome className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{stats.totalVenues}</div>
              <div className="text-sm text-gray-600">My Venues</div>
            </div>
            <div className="card text-center">
              <FiTag className="w-8 h-8 text-accent-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{stats.activeOffers}</div>
              <div className="text-sm text-gray-600">Active Offers</div>
            </div>
            <div className="card text-center">
              <FiStar className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{stats.totalReviews}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="card text-center">
              <FiUsers className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-gray-900">{stats.totalFavorites}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Get Started */}
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
                <h2 className="text-2xl font-display font-bold mb-4">🎉 Get Started</h2>
                <p className="text-gray-700 mb-6">
                  Welcome to your venue owner dashboard! Here's how to get the most out of Kids Sports Zone:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Claim or Create Your Venue</h3>
                      <p className="text-sm text-gray-600">
                        Search for your venue and claim it, or create a new listing if it doesn't exist yet.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Complete Your Profile</h3>
                      <p className="text-sm text-gray-600">
                        Add photos, update information, set your schedule, and showcase what makes your venue special.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Create Special Offers</h3>
                      <p className="text-sm text-gray-600">
                        Attract more families with exclusive deals and promotions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link to="/search" className="btn-primary">
                    Find My Venue
                  </Link>
                  <Link to="/dashboard/venue/add" className="btn-outline">
                    Create New Listing
                  </Link>
                </div>
              </div>

              {/* My Venues */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">My Venues</h2>
                  <Link to="/dashboard/venue/add" className="btn-primary flex items-center gap-2">
                    <FiPlus className="w-4 h-4" />
                    Add Venue
                  </Link>
                </div>

                {venues.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2">No venues yet</h3>
                    <p className="text-gray-600 mb-6">
                      Claim an existing venue or create a new listing to get started
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link to="/search" className="btn-outline">
                        Search for My Venue
                      </Link>
                      <Link to="/dashboard/venue/add" className="btn-primary">
                        Create New Listing
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {venues.map(venue => (
                      <div key={venue.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{venue.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {venue.suburb}, {venue.state}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <FiStar className="w-4 h-4 text-yellow-500" />
                                <span>{venue.average_rating || 0} ({venue.review_count || 0} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiUsers className="w-4 h-4 text-gray-500" />
                                <span>{venue.favorite_count || 0} favorites</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                venue.status === 'published' ? 'bg-green-100 text-green-800' :
                                venue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link
                              to={`/venue/${venue.slug}`}
                              target="_blank"
                              className="btn-outline-sm flex items-center gap-1"
                            >
                              <FiEye className="w-4 h-4" />
                              View
                            </Link>
                            <Link
                              to={`/dashboard/venue/edit/${venue.slug}`}
                              className="btn-primary-sm flex items-center gap-1"
                            >
                              <FiEdit className="w-4 h-4" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Offers */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">My Offers</h2>
                  {venues.length > 0 && (
                    <button
                      onClick={() => handleCreateOffer(venues[0])}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" />
                      Create Offer
                    </button>
                  )}
                </div>

                {showOfferForm && selectedVenueForOffer && (
                  <div className="mb-6 p-6 bg-warm-50 border-2 border-primary-200 rounded-lg">
                    <OfferForm
                      venueId={selectedVenueForOffer.id}
                      offer={editingOffer}
                      onSuccess={handleOfferFormSuccess}
                      onCancel={() => {
                        setShowOfferForm(false);
                        setEditingOffer(null);
                      }}
                    />
                  </div>
                )}

                {allOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <FiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2">No offers yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create special offers to attract more families to your venue
                    </p>
                    {venues.length > 0 ? (
                      <button
                        onClick={() => handleCreateOffer(venues[0])}
                        className="btn-primary"
                      >
                        Create Your First Offer
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">Add a venue first to create offers</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allOffers.map(offer => {
                      const isExpired = new Date(offer.expires_at) < new Date();
                      const isActive = offer.is_active && !isExpired;

                      return (
                        <div
                          key={offer.id}
                          className={`border rounded-lg p-4 ${
                            isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                                {isActive ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    Active
                                  </span>
                                ) : isExpired ? (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                    Expired
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{offer.venue?.name}</p>
                              {offer.description && (
                                <p className="text-sm text-gray-700 mb-2">{offer.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3" />
                                  <span>Expires: {formatDate(offer.expires_at)}</span>
                                </div>
                                {offer.discount_text && (
                                  <div className="font-semibold text-green-700">
                                    {offer.discount_text}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEditOffer(offer)}
                                className="btn-outline-sm flex items-center gap-1"
                              >
                                <FiEdit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteOffer(offer.id)}
                                className="btn-outline-sm flex items-center gap-1 text-red-600 hover:bg-red-50"
                              >
                                <FiTrash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Reviews */}
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">Recent Reviews</h2>
                  {recentReviews.length > 0 && (
                    <Link to="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View All →
                    </Link>
                  )}
                </div>

                {recentReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold mb-2">No reviews yet</h3>
                    <p className="text-gray-600">
                      Reviews from parents will appear here once you have an active venue listing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentReviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user?.full_name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-500">{review.venue?.name}</p>
                          </div>
                          <div className="text-right">
                            <StarRating rating={review.rating} size="sm" />
                            <p className="text-xs text-gray-500 mt-1">{formatDate(review.created_at)}</p>
                          </div>
                        </div>
                        {review.title && (
                          <p className="font-medium text-gray-900 text-sm mb-1">{review.title}</p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => venues.length > 0 && handleCreateOffer(venues[0])}
                    disabled={venues.length === 0}
                    className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiPlus className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-700">Create Offer</span>
                  </button>
                  <Link to="/dashboard/venue/add" className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiHome className="w-5 h-5 text-secondary-500" />
                    <span className="text-gray-700">Add Venue</span>
                  </Link>
                  <button className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiTrendingUp className="w-5 h-5 text-accent-500" />
                    <span className="text-gray-700">View Analytics</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 hover:bg-warm-50 rounded-lg transition-colors w-full text-left">
                    <FiSettings className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                  </button>
                </div>
              </div>

              {/* Tips & Resources */}
              <div className="card bg-secondary-50 border-2 border-secondary-200">
                <h3 className="font-display font-semibold text-lg mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Add high-quality photos to attract more families</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Keep your schedule and contact info up to date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Respond to reviews to build trust</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-600">•</span>
                    <span>Create special offers to boost bookings</span>
                  </li>
                </ul>
              </div>

              {/* Upgrade CTA */}
              <div className="card bg-gradient-to-br from-accent-500 to-primary-500 text-white">
                <h3 className="font-display font-bold text-lg mb-2">✨ Promote Your Venue</h3>
                <p className="text-white/90 text-sm mb-4">
                  Get featured placement and reach more families with our promotion packages
                </p>
                <button className="bg-white text-accent-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full">
                  Learn More
                </button>
              </div>

              {/* Account Info */}
              <div className="card bg-warm-100 border-2 border-primary-200">
                <h3 className="font-display font-semibold text-lg mb-3">Your Account</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{profile?.full_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 truncate max-w-[150px]">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium text-gray-900">Venue Owner</span>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="btn-outline w-full mt-4 text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
