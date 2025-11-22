import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiDollarSign, FiUsers, FiImage, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/supabase';
import { categories } from '../../data/categories';
import { states, getCitiesByState } from '../../data/locations';

export default function AddVenuePage() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    category_ids: [],

    // Location
    address: '',
    suburb: '',
    city_slug: '',
    state_id: '',
    postcode: '',
    latitude: null,
    longitude: null,

    // Contact
    phone: '',
    email: '',
    website: '',

    // Details
    age_min: 1,
    age_max: 18,
    indoor: true,
    price_range: '$$',

    // Hours (simplified - can be expanded)
    hours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    },

    // Amenities
    amenities: {
      parking: false,
      changing_rooms: false,
      cafe: false,
      equipment_provided: false,
      disability_access: false,
      air_conditioning: false
    }
  });

  const cities = formData.state_id ? getCitiesByState(formData.state_id) : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }));
  };

  const handleAmenityToggle = (amenityKey) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenityKey]: !prev.amenities[amenityKey]
      }
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value
        }
      }
    }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.name || !formData.description || formData.category_ids.length === 0) {
        setError('Please fill in all required fields in Step 1');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.address || !formData.state_id || !formData.city_slug || !formData.postcode) {
        setError('Please fill in all required location fields');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.phone || !formData.email) {
        setError('Please provide phone and email contact information');
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please provide a valid email address');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    setError('');
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Prepare venue data
      const venueData = {
        ...formData,
        slug,
        owner_id: user.id,
        status: 'pending', // Pending admin approval
        claimed: true,
        is_promoted: false,
        average_rating: 0,
        review_count: 0,
        favorite_count: 0
      };

      // Create venue
      const { data, error: createError } = await db.createVenue(venueData);

      if (createError) throw createError;

      setSuccess(true);

      // Redirect to success screen
      setTimeout(() => {
        navigate('/dashboard/venue');
      }, 3000);

    } catch (err) {
      console.error('Error creating venue:', err);
      setError(err.message || 'Failed to create venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>Venue Submitted | Kids Sports Zone</title>
        </Helmet>

        <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card text-center">
              <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold mb-2">Venue Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Your venue has been submitted for review. Our team will review it and approve it within 24-48 hours.
                You'll receive an email notification once it's live.
              </p>
              <button
                onClick={() => navigate('/dashboard/venue')}
                className="btn-primary w-full"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Add Your Venue | Kids Sports Zone</title>
        <meta name="description" content="List your sports venue or activity center on Kids Sports Zone" />
      </Helmet>

      <div className="min-h-screen bg-warm-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-12">
          <div className="section-container">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Add Your Venue
            </h1>
            <p className="text-white/90">
              List your venue and reach thousands of families looking for kids activities
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="section-container">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      s === step
                        ? 'bg-primary-500 text-white'
                        : s < step
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 5 && (
                    <div
                      className={`w-12 h-1 ${
                        s < step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              Step {step} of 5: {
                step === 1 ? 'Basic Information' :
                step === 2 ? 'Location Details' :
                step === 3 ? 'Contact Information' :
                step === 4 ? 'Venue Details' :
                'Review & Submit'
              }
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="section-container py-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <FiHome className="text-2xl text-primary-500" />
                    <h2 className="text-2xl font-display font-bold">Basic Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Sydney Swim School"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className="input-field"
                        placeholder="Describe your venue, programs, and what makes it special..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 100 characters. Be descriptive to attract more families!
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-3">
                        Select all activities offered at your venue (select at least one)
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              formData.category_ids.includes(category.id)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{category.icon}</span>
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {formData.category_ids.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          {formData.category_ids.length} {formData.category_ids.length === 1 ? 'category' : 'categories'} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location Details */}
              {step === 2 && (
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <FiMapPin className="text-2xl text-primary-500" />
                    <h2 className="text-2xl font-display font-bold">Location Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suburb
                      </label>
                      <input
                        type="text"
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Bondi Beach"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="state_id"
                          value={formData.state_id}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select state...</option>
                          {states.map(state => (
                            <option key={state.id} value={state.id}>
                              {state.name} ({state.abbreviation})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City/Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="city_slug"
                          value={formData.city_slug}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={!formData.state_id}
                        >
                          <option value="">Select city...</option>
                          {cities.map(city => (
                            <option key={city.slug} value={city.slug}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="2000"
                        required
                        maxLength={4}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> We'll automatically geocode your address to show your venue on maps.
                        You can update the exact location later if needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {step === 3 && (
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <FiPhone className="text-2xl text-primary-500" />
                    <h2 className="text-2xl font-display font-bold">Contact Information</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="(02) 1234 5678"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="info@yourvenue.com.au"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="https://www.yourvenue.com.au"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Privacy:</strong> Your contact information will be displayed publicly so families can reach you.
                        Make sure these are your business contact details, not personal information.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Venue Details */}
              {step === 4 && (
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <FiUsers className="text-2xl text-primary-500" />
                    <h2 className="text-2xl font-display font-bold">Venue Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Age
                        </label>
                        <input
                          type="number"
                          name="age_min"
                          value={formData.age_min}
                          onChange={handleInputChange}
                          className="input-field"
                          min="1"
                          max="18"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Age
                        </label>
                        <input
                          type="number"
                          name="age_max"
                          value={formData.age_max}
                          onChange={handleInputChange}
                          className="input-field"
                          min="1"
                          max="18"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="indoor"
                            checked={formData.indoor === true}
                            onChange={() => setFormData(prev => ({ ...prev, indoor: true }))}
                            className="w-4 h-4 text-primary-500"
                          />
                          <span>Indoor</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="indoor"
                            checked={formData.indoor === false}
                            onChange={() => setFormData(prev => ({ ...prev, indoor: false }))}
                            className="w-4 h-4 text-primary-500"
                          />
                          <span>Outdoor</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        name="price_range"
                        value={formData.price_range}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="$">$ - Budget friendly (under $20/session)</option>
                        <option value="$$">$$ - Moderate ($20-$40/session)</option>
                        <option value="$$$">$$$ - Premium ($40-$60/session)</option>
                        <option value="$$$$">$$$$ - Luxury (over $60/session)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Amenities & Features
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {Object.entries({
                          parking: 'Parking Available',
                          changing_rooms: 'Changing Rooms',
                          cafe: 'Café/Refreshments',
                          equipment_provided: 'Equipment Provided',
                          disability_access: 'Disability Access',
                          air_conditioning: 'Air Conditioning'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.amenities[key]}
                              onChange={() => handleAmenityToggle(key)}
                              className="w-4 h-4 text-primary-500 rounded"
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Opening Hours
                      </label>
                      <div className="space-y-3">
                        {Object.entries(formData.hours).map(([day, hours]) => (
                          <div key={day} className="flex items-center gap-3">
                            <div className="w-28 font-medium text-sm capitalize">{day}</div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={hours.closed}
                                onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                                className="w-4 h-4 text-primary-500 rounded"
                              />
                              <span className="text-sm">Closed</span>
                            </label>
                            {!hours.closed && (
                              <>
                                <input
                                  type="time"
                                  value={hours.open}
                                  onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                  className="input-field py-1 px-2 text-sm"
                                />
                                <span className="text-sm text-gray-500">to</span>
                                <input
                                  type="time"
                                  value={hours.close}
                                  onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                  className="input-field py-1 px-2 text-sm"
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {step === 5 && (
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <FiCheckCircle className="text-2xl text-primary-500" />
                    <h2 className="text-2xl font-display font-bold">Review & Submit</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Please Review Your Information</h3>
                      <p className="text-sm text-blue-800">
                        Your venue will be submitted for review and should be live within 24-48 hours.
                        Make sure all information is accurate before submitting.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-semibold mb-2">Basic Information</h3>
                        <div className="text-sm space-y-1">
                          <p><strong>Name:</strong> {formData.name}</p>
                          <p><strong>Description:</strong> {formData.description.substring(0, 150)}...</p>
                          <p><strong>Categories:</strong> {formData.category_ids.length} selected</p>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-semibold mb-2">Location</h3>
                        <div className="text-sm space-y-1">
                          <p>{formData.address}</p>
                          {formData.suburb && <p>{formData.suburb}</p>}
                          <p>{formData.city_slug}, {formData.state_id?.toUpperCase()} {formData.postcode}</p>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="font-semibold mb-2">Contact</h3>
                        <div className="text-sm space-y-1">
                          <p><strong>Phone:</strong> {formData.phone}</p>
                          <p><strong>Email:</strong> {formData.email}</p>
                          {formData.website && <p><strong>Website:</strong> {formData.website}</p>}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Details</h3>
                        <div className="text-sm space-y-1">
                          <p><strong>Ages:</strong> {formData.age_min}-{formData.age_max} years</p>
                          <p><strong>Type:</strong> {formData.indoor ? 'Indoor' : 'Outdoor'}</p>
                          <p><strong>Price Range:</strong> {formData.price_range}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">What Happens Next?</h3>
                      <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                        <li>Your venue will be submitted for admin review</li>
                        <li>We'll verify your information within 24-48 hours</li>
                        <li>You'll receive an email notification when it's approved</li>
                        <li>Once approved, your venue will be live and searchable</li>
                        <li>You can add photos and offers from your dashboard</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-outline"
                    disabled={loading}
                  >
                    Previous
                  </button>
                )}

                <div className="ml-auto">
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Venue for Review'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
