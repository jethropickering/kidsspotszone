import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { initialize, profile } = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Wait a moment for Supabase to process the auth token from URL hash
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Initialize auth store to get user session
      await initialize();

      // Get the user profile to determine role
      const { profile: userProfile } = useAuthStore.getState();

      // Redirect based on role
      if (userProfile?.role === 'venue_owner') {
        navigate('/dashboard/venue', { replace: true });
      } else if (userProfile?.role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Error handling auth callback:', err);
      setError('Failed to complete sign in. Please try again.');

      // Redirect to sign in after error
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 3000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="card max-w-md text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 mt-4">Completing sign in...</p>
      </div>
    </div>
  );
}
