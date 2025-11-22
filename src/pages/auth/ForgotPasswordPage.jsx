import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { authHelpers } from '../../services/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    const { error: resetError } = await authHelpers.resetPassword(email);

    if (resetError) {
      setError(resetError.message || 'Failed to send reset email. Please try again.');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>Check Your Email | Kids Sports Zone</title>
        </Helmet>

        <div className="min-h-screen flex items-center justify-center bg-warm-50 py-12 px-4">
          <div className="max-w-md w-full">
            <div className="card text-center py-12">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-primary-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Check Your Email
              </h1>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:
              </p>
              <p className="text-primary-600 font-semibold mb-6">
                {email}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>

              <div className="space-y-3">
                <Link to="/signin" className="btn-primary w-full text-center block">
                  Back to Sign In
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="btn-outline w-full"
                >
                  Try Another Email
                </button>
              </div>

              <div className="mt-8 p-4 bg-warm-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Didn't receive the email?</strong>
                  <br />
                  Check your spam folder or try again with a different email address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | Kids Sports Zone</title>
        <meta name="description" content="Reset your Kids Sports Zone password" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-warm-50 py-12 px-4">
        <div className="max-w-md w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-5xl">🏃</span>
              <span className="text-2xl font-display font-bold text-primary-600">
                Kids Sports Zone
              </span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Reset Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="you@example.com"
                    className="input-field pl-12"
                    required
                    autoFocus
                  />
                </div>
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to Sign In */}
            <div className="mt-6">
              <Link
                to="/signin"
                className="text-gray-600 hover:text-primary-600 text-sm flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="card mt-6 bg-warm-50 border border-warm-200">
            <h3 className="font-display font-semibold text-gray-900 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              If you're having trouble resetting your password, please contact our support team.
            </p>
            <Link to="/contact" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Contact Support →
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
