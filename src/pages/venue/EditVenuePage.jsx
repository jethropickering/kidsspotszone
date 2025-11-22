import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { db, supabase } from '../../services/supabase';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EditVenuePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    suburb: '',
    city: '',
    city_slug: '',
    state_id: '',
    postcode: '',
    latitude: null,
    longitude: null,
    phone: '',
    email: '',
    website: '',
    facebook_url: '',
    instagram_url: '',
    category_ids: [],
    age_min: 1,
    age_max: 18,
    indoor: false,
    outdoor: false,
    price_range: 2,
    facilities: [],
    hours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '15:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    }
  });

  useEffect(() => {
    loadVenue();
  }, [slug, user]);

  const loadVenue = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setLoading(true);

    try {
      // Get venue by slug
      const { data: venueData, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('slug', slug)
        .single();

      if (venueError) throw venueError;

      // Check ownership
      if (venueData.owner_id !== user.id && profile?.role !== 'admin') {
        setError('You do not have permission to edit this venue');
        setLoading(false);
        return;
      }

      setVenue(venueData);

      // Populate form with existing data
      setFormData({
        name: venueData.name || '',
        description: venueData.description || '',
        address: venueData.address || '',
        suburb: venueData.suburb || '',
        city: venueData.city || '',
        city_slug: venueData.city_slug || '',
        state_id: venueData.state_id || '',
        postcode: venueData.postcode || '',
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        phone: venueData.phone || '',
        email: venueData.email || '',
        website: venueData.website || '',
        facebook_url: venueData.facebook_url || '',
        instagram_url: venueData.instagram_url || '',
        category_ids: venueData.category_ids || [],
        age_min: venueData.age_min || 1,
        age_max: venueData.age_max || 18,
        indoor: venueData.indoor || false,
        outdoor: venueData.outdoor || false,
        price_range: venueData.price_range || 2,
        facilities: venueData.facilities || [],
        hours: venueData.hours || formData.hours
      });

    } catch (error) {
      console.error('Error loading venue:', error);
      setError('Failed to load venue');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      // Update venue
      const { error: updateError } = await db.updateVenue(venue.id, {
        ...formData,
        updated_at: new Date().toISOString()
      });

      if (updateError) throw updateError;

      // Show success and redirect
      alert('Venue updated successfully!');
      navigate(`/venue/${venue.slug}`);

    } catch (error) {
      console.error('Error updating venue:', error);
      setError('Failed to update venue. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading venue..." />;
  }

  if (error && !venue) {
    return (
      <div className="section-container py-12">
        <div className="card text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/dashboard/venue')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {venue?.name} | Kids Sports Zone</title>
      </Helmet>

      <div className="bg-warm-50 min-h-screen py-8">
        <div className="section-container">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/venue')}
                className="btn-outline flex items-center gap-2"
              >
                <FiArrowLeft />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-display font-bold">Edit Venue</h1>
                <p className="text-gray-600">{venue?.name}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <FiSave />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Note about approval */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Changes to your venue will be reviewed by our team before being published.
              Your venue will remain visible with the current information until changes are approved.
            </p>
          </div>

          {/* Simple Edit Form */}
          <div className="card max-w-4xl">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="input-field resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={formData.facebook_url}
                      onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                      className="input-field"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                </div>
              </div>

              {/* Age Range & Price */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Details</h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="18"
                      value={formData.age_min}
                      onChange={(e) => setFormData({ ...formData, age_min: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="18"
                      value={formData.age_max}
                      onChange={(e) => setFormData({ ...formData, age_max: parseInt(e.target.value) })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={formData.price_range}
                      onChange={(e) => setFormData({ ...formData, price_range: parseInt(e.target.value) })}
                      className="input-field"
                    >
                      <option value={1}>$ Budget Friendly</option>
                      <option value={2}>$$ Moderate</option>
                      <option value={3}>$$$ Premium</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.indoor}
                      onChange={(e) => setFormData({ ...formData, indoor: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <span className="text-sm">Indoor Facility</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.outdoor}
                      onChange={(e) => setFormData({ ...formData, outdoor: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <span className="text-sm">Outdoor Facility</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => navigate(`/venue/${venue.slug}`)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
