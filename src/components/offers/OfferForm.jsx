import { useState } from 'react';
import { FiTag, FiCalendar, FiX } from 'react-icons/fi';
import { db } from '../../services/supabase';

export default function OfferForm({ venueId, offer = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    discount_text: offer?.discount_text || '',
    terms: offer?.terms || '',
    starts_at: offer?.starts_at ? new Date(offer.starts_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    expires_at: offer?.expires_at ? new Date(offer.expires_at).toISOString().slice(0, 16) : '',
    is_active: offer?.is_active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate
      if (!formData.title || !formData.expires_at) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Prepare data
      const offerData = {
        venue_id: venueId,
        title: formData.title,
        description: formData.description,
        discount_text: formData.discount_text,
        terms: formData.terms,
        starts_at: new Date(formData.starts_at).toISOString(),
        expires_at: new Date(formData.expires_at).toISOString(),
        is_active: formData.is_active,
      };

      let result;
      if (offer) {
        // Update existing offer
        result = await db.updateOffer(offer.id, offerData);
      } else {
        // Create new offer
        result = await db.createOffer(offerData);
      }

      if (result.error) throw result.error;

      alert(offer ? 'Offer updated successfully!' : 'Offer created successfully!');
      onSuccess && onSuccess();
    } catch (err) {
      console.error('Error saving offer:', err);
      setError(err.message || 'Failed to save offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiTag className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold">
            {offer ? 'Edit Offer' : 'Create New Offer'}
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offer Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., First Class Free, 20% Off Membership"
          className="input"
          required
        />
      </div>

      {/* Discount Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Discount Text
        </label>
        <input
          type="text"
          name="discount_text"
          value={formData.discount_text}
          onChange={handleChange}
          placeholder="e.g., 20% off, Free trial, $50 discount"
          className="input"
        />
        <p className="text-xs text-gray-500 mt-1">
          Short text to display on venue cards (e.g., "20% off")
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the offer in detail..."
          className="input"
        />
      </div>

      {/* Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Terms & Conditions
        </label>
        <textarea
          name="terms"
          value={formData.terms}
          onChange={handleChange}
          rows={2}
          placeholder="Any restrictions or conditions..."
          className="input"
        />
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Starts At
          </label>
          <input
            type="datetime-local"
            name="starts_at"
            value={formData.starts_at}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Expires At *
          </label>
          <input
            type="datetime-local"
            name="expires_at"
            value={formData.expires_at}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Offer is active (visible to users)
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline flex-1"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={loading}
        >
          {loading ? 'Saving...' : (offer ? 'Update Offer' : 'Create Offer')}
        </button>
      </div>
    </form>
  );
}
