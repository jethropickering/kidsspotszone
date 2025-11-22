import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiMapPin, FiClock, FiPhone, FiMail, FiGlobe, FiFlag,
  FiDollarSign, FiUsers, FiCalendar, FiShare2, FiHeart
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { db } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';
import StarRating from '../../components/common/StarRating';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import VenueGallery from '../../components/venue/VenueGallery';
import ReviewList from '../../components/venue/ReviewList';
import ReviewForm from '../../components/venue/ReviewForm';
import OfferCard from '../../components/venue/OfferCard';
import { generateLocalBusinessSchema } from '../../utils/seo';

export default function VenuePage() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    loadVenue();
  }, [slug]);

  const loadVenue = async () => {
    setLoading(true);
    const { data, error } = await db.getVenueBySlug(slug);

    if (data) {
      setVenue(data);

      // Check if user has favorited this venue
      if (user) {
        const { data: favorites } = await db.getUserFavorites(user.id);
        setIsFavorite(favorites?.some(f => f.venue_id === data.id));
      }
    }

    setLoading(false);
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }

    const { removed } = await db.toggleFavorite(user.id, venue.id);
    setIsFavorite(!removed);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: venue.name,
        text: venue.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading venue details..." />;
  }

  if (!venue) {
    return (
      <div className="section-container py-12">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-display font-bold mb-2">Venue Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find that venue.</p>
          <Link to="/search" className="btn-primary">
            Browse All Venues
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: venue.categories?.[0]?.category?.name || 'Activities', url: `/${venue.categories?.[0]?.category?.slug}` },
    { name: venue.city, url: `/${venue.state_id}/${venue.city_slug}` },
    { name: venue.name }
  ];

  const structuredData = generateLocalBusinessSchema(venue);

  return (
    <>
      <Helmet>
        <title>{venue.name} | {venue.city} | Kids Sports Zone</title>
        <meta name="description" content={venue.description} />
        <meta name="keywords" content={`${venue.name}, ${venue.city}, ${venue.categories?.map(c => c.category?.name).join(', ')}`} />

        <meta property="og:title" content={venue.name} />
        <meta property="og:description" content={venue.description} />
        <meta property="og:image" content={venue.featured_image} />
        <meta property="og:type" content="business.business" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="bg-warm-50">
        {/* Header Actions */}
        <div className="section-container py-4">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex justify-between items-start gap-4 mt-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {venue.categories?.map(vc => (
                  <Link
                    key={vc.category?.id}
                    to={`/${vc.category?.slug}`}
                    className="badge badge-primary"
                  >
                    {vc.category?.icon} {vc.category?.name}
                  </Link>
                ))}
                {venue.is_promoted && (
                  <span className="badge bg-accent-500 text-white">
                    ✨ Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                {venue.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                {venue.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={venue.average_rating} size="md" />
                    <span className="text-sm">({venue.review_count} reviews)</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  <span>{venue.suburb}, {venue.city}</span>
                </div>

                {venue.price_range && (
                  <div className="flex items-center gap-1">
                    <FiDollarSign className="w-4 h-4" />
                    <span>{'$'.repeat(venue.price_range)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleFavoriteClick}
                className={`btn-outline p-3 ${isFavorite ? 'text-red-500 border-red-500' : ''}`}
                title="Save to favorites"
              >
                {isFavorite ? <FaHeart className="w-5 h-5" /> : <FiHeart className="w-5 h-5" />}
              </button>
              <button
                onClick={handleShare}
                className="btn-outline p-3"
                title="Share this venue"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <VenueGallery venue={venue} />

        {/* Main Content */}
        <div className="section-container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="card">
                <h2 className="text-2xl font-display font-bold mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {venue.description}
                </p>
              </div>

              {/* Special Offers */}
              {venue.offers?.filter(o => o.is_active).length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Special Offers</h2>
                  <div className="grid gap-4">
                    {venue.offers.filter(o => o.is_active).map(offer => (
                      <OfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">
                    Reviews ({venue.review_count})
                  </h2>
                  {user && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="btn-primary"
                    >
                      Write a Review
                    </button>
                  )}
                  {!user && (
                    <Link to="/signin" className="btn-primary">
                      Sign In to Review
                    </Link>
                  )}
                </div>

                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm
                      venueId={venue.id}
                      onSuccess={() => {
                        setShowReviewForm(false);
                        loadVenue(); // Reload to show new review
                      }}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}

                <ReviewList venueId={venue.id} />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="card sticky top-24">
                <h3 className="font-display font-semibold text-lg mb-4">Contact Information</h3>

                <div className="space-y-3">
                  {venue.address && (
                    <div className="flex gap-3">
                      <FiMapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Address</div>
                        <p className="text-gray-900">{venue.address}</p>
                        <p className="text-gray-600">{venue.suburb}, {venue.city} {venue.postcode}</p>
                      </div>
                    </div>
                  )}

                  {venue.phone && (
                    <div className="flex gap-3">
                      <FiPhone className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Phone</div>
                        <a href={`tel:${venue.phone}`} className="text-primary-600 hover:text-primary-700">
                          {venue.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {venue.email && (
                    <div className="flex gap-3">
                      <FiMail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Email</div>
                        <a href={`mailto:${venue.email}`} className="text-primary-600 hover:text-primary-700 break-all">
                          {venue.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {venue.website && (
                    <div className="flex gap-3">
                      <FiGlobe className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Website</div>
                        <a
                          href={venue.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 break-all"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}

                  {venue.opening_hours && (
                    <div className="flex gap-3">
                      <FiClock className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Hours</div>
                        <p className="text-gray-900 whitespace-pre-line">{venue.opening_hours}</p>
                      </div>
                    </div>
                  )}
                </div>

                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center block mt-6"
                  >
                    Visit Website
                  </a>
                )}
              </div>

              {/* Details Card */}
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4">Details</h3>

                <div className="space-y-3 text-sm">
                  {(venue.age_min || venue.age_max) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FiUsers className="w-4 h-4" />
                        Age Range
                      </span>
                      <span className="font-medium text-gray-900">
                        {venue.age_min}-{venue.age_max} years
                      </span>
                    </div>
                  )}

                  {venue.indoor !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        Location Type
                      </span>
                      <span className="font-medium text-gray-900">
                        {venue.indoor === true ? 'Indoor' : venue.indoor === false ? 'Outdoor' : 'Both'}
                      </span>
                    </div>
                  )}

                  {venue.price_range && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FiDollarSign className="w-4 h-4" />
                        Price Range
                      </span>
                      <span className="font-medium text-gray-900">
                        {'$'.repeat(venue.price_range)}
                      </span>
                    </div>
                  )}

                  {venue.class_duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        Class Duration
                      </span>
                      <span className="font-medium text-gray-900">
                        {venue.class_duration}
                      </span>
                    </div>
                  )}

                  {venue.term_dates && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        Term Dates
                      </span>
                      <span className="font-medium text-gray-900">
                        {venue.term_dates}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Claim/Report Card */}
              <div className="card bg-warm-100 border-2 border-primary-200">
                {!venue.claimed ? (
                  <>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      Is this your venue?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Claim this listing for free to manage your information and respond to reviews.
                    </p>
                    <Link to={user ? `/claim/${venue.slug}` : '/signin'} className="btn-primary w-full text-center block">
                      Claim This Listing
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      Verified Listing ✓
                    </h3>
                    <p className="text-sm text-gray-600">
                      This listing has been claimed and verified by the venue owner.
                    </p>
                  </>
                )}

                <div className="border-t border-primary-300 mt-4 pt-4">
                  <button
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="text-gray-600 hover:text-primary-600 text-sm flex items-center gap-2 w-full"
                  >
                    <FiFlag className="w-4 h-4" />
                    Report outdated information
                  </button>

                  {showReportForm && (
                    <div className="mt-4">
                      <textarea
                        placeholder="Please describe what information is outdated..."
                        className="input-field resize-none"
                        rows="3"
                      />
                      <div className="flex gap-2 mt-2">
                        <button className="btn-primary text-sm flex-1">
                          Submit Report
                        </button>
                        <button
                          onClick={() => setShowReportForm(false)}
                          className="btn-outline text-sm flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
