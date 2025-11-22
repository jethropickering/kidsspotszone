import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiDollarSign, FiTag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import { formatPriceRange, getAgeRangeLabel } from '../../utils/helpers';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/supabase';
import { useState } from 'react';

export default function VenueCard({ venue, showDistance = false, distance = null }) {
  const { user } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(venue.is_favorite || false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to sign in
      window.location.href = '/signin';
      return;
    }

    setFavoriteLoading(true);
    const { removed } = await db.toggleFavorite(user.id, venue.id);
    setIsFavorite(!removed);
    setFavoriteLoading(false);
  };

  return (
    <Link
      to={`/venue/${venue.slug}`}
      className="card group hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Promoted Badge */}
      {venue.is_promoted && (
        <div className="absolute top-3 left-3 z-10">
          <span className="badge bg-accent-500 text-white font-semibold px-3 py-1.5 shadow-lg">
            <FiTag className="inline w-3 h-3 mr-1" />
            Featured
          </span>
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={favoriteLoading}
        className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
      >
        {isFavorite ? (
          <FaHeart className="w-5 h-5 text-accent-500" />
        ) : (
          <FiHeart className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
        {venue.featured_image ? (
          <img
            src={venue.featured_image}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {venue.categories?.[0]?.category?.icon || '🏃'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
          {venue.name}
        </h3>

        {/* Location & Distance */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FiMapPin className="w-4 h-4 text-secondary-500" />
          <span className="text-sm">
            {venue.suburb}, {venue.city}
            {showDistance && distance && (
              <span className="text-primary-600 font-medium ml-1">
                ({distance.toFixed(1)}km away)
              </span>
            )}
          </span>
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {venue.description}
          </p>
        )}

        {/* Categories */}
        {venue.categories && venue.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {venue.categories.slice(0, 3).map((vc, index) => (
              <span
                key={index}
                className="badge badge-primary text-xs"
              >
                {vc.category?.icon} {vc.category?.name}
              </span>
            ))}
            {venue.categories.length > 3 && (
              <span className="badge bg-gray-100 text-gray-600 text-xs">
                +{venue.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Rating */}
            {venue.average_rating > 0 && (
              <StarRating rating={venue.average_rating} size="sm" />
            )}

            {/* Review Count */}
            {venue.review_count > 0 && (
              <span className="text-xs text-gray-500">
                ({venue.review_count} review{venue.review_count !== 1 ? 's' : ''})
              </span>
            )}
          </div>

          {/* Price Range */}
          {venue.price_range && (
            <div className="flex items-center gap-1 text-gray-600">
              <FiDollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatPriceRange(venue.price_range)}
              </span>
            </div>
          )}
        </div>

        {/* Age Range */}
        {venue.age_min && venue.age_max && (
          <div className="mt-3 text-xs text-gray-500">
            {getAgeRangeLabel(venue.age_min, venue.age_max)}
          </div>
        )}

        {/* Active Offers Badge */}
        {venue.has_offers && (
          <div className="mt-3">
            <span className="badge bg-green-100 text-green-800 text-xs">
              🎁 Special Offers Available
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
