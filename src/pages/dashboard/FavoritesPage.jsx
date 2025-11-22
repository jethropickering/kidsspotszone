import { useState, useEffect } from 'react';
import { FiHeart, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/supabase';
import VenueCard from '../../components/venue/VenueCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await db.getUserFavorites(user.id);

      if (error) throw error;

      setFavorites(data || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (venueId) => {
    try {
      await db.toggleFavorite(user.id, venueId);
      setFavorites(favorites.filter(fav => fav.venue_id !== venueId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove favorite. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FiHeart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Favorites
          </h1>
        </div>
        <p className="text-gray-600">
          Venues you've saved for quick access
        </p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="card text-center py-16">
          <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start exploring venues and save your favorites for quick access.
          </p>
          <Link to="/search" className="btn-primary">
            Browse Venues
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-red-50 to-pink-50 border-red-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <FiHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Locations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(favorites.map(f => f.venue.city)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">With Offers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {favorites.filter(f => f.venue.offers && f.venue.offers.length > 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="relative">
                <VenueCard venue={favorite.venue} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
