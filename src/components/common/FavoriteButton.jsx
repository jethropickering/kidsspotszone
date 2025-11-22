import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function FavoriteButton({ venueId, className = '' }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && venueId) {
      checkFavoriteStatus();
    }
  }, [user, venueId]);

  const checkFavoriteStatus = async () => {
    const { isFavorited } = await db.isFavorited(user.id, venueId);
    setIsFavorited(isFavorited);
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/signin?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);

    try {
      const { removed, error } = await db.toggleFavorite(user.id, venueId);

      if (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorite. Please try again.');
        return;
      }

      setIsFavorited(!removed);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded-full
        bg-white shadow-md
        hover:bg-red-50
        transition-all duration-200
        disabled:opacity-50
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <FaHeart className="w-5 h-5 text-red-500" />
      ) : (
        <FiHeart className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}
