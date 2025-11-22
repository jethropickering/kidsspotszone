import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiCheck } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { initialize, signUp } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'parent' // default to parent
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    const { data, error: signUpError } = await signUp(
      formData.email,
      formData.password,
      {
        full_name: formData.fullName.trim(),
        role: formData.role
      }
    );

    if (signUpError) {
      setError(signUpError.message || 'Failed to create account. Please try again.');
      setLoading(false);
    } else {
      // Show success message
      setSuccess(true);
      setLoading(false);

      // Wait for profile to be created, then redirect
      setTimeout(async () => {
        // Initialize auth to get user session
        await initialize();

        // Wait a bit more for profile to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect based on role
        navigate(formData.role === 'venue_owner' ? '/dashboard/venue' : '/dashboard');
      }, 2000);
    }
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>Account Created | Kids Sports Zone</title>
        </Helmet>

        <div className="min-h-screen flex items-center justify-center bg-warm-50 py-12 px-4">
          <div className="max-w-md w-full">
            <div className="card text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Account Created!
              </h1>
              <p className="text-gray-600 mb-2">
                Welcome to Kids Sports Zone, {formData.fullName}!
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to your dashboard...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Kids Sports Zone</title>
        <meta name="description" content="Create your Kids Sports Zone account to save favorites, write reviews, and discover activities" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-warm-50 py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-5xl">🏃</span>
              <span className="text-2xl font-display font-bold text-primary-600">
                Kids Sports Zone
              </span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join thousands of families discovering amazing activities
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a... <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Parent Role */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('parent')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.role === 'parent'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">👨‍👩‍👧‍👦</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Parent</div>
                        <p className="text-sm text-gray-600">
                          Looking for activities for my kids
                        </p>
                      </div>
                      {formData.role === 'parent' && (
                        <FiCheck className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </button>

                  {/* Venue Owner Role */}
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('venue_owner')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.role === 'venue_owner'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">🏢</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">Venue Owner</div>
                        <p className="text-sm text-gray-600">
                          I run or manage an activity venue
                        </p>
                      </div>
                      {formData.role === 'venue_owner' && (
                        <FiCheck className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link
              to="/signin"
              className="w-full btn-outline text-center block"
            >
              Sign In
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
