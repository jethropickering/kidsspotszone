import { useState } from 'react';
import { FiMail, FiCheck } from 'react-icons/fi';
import { db } from '../../services/supabase';
import { isValidEmail } from '../../utils/helpers';

export default function NewsletterForm({ inline = false }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    const { error: submitError } = await db.subscribeNewsletter(email);

    if (submitError) {
      if (submitError.code === '23505') {
        setError('This email is already subscribed');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setEmail('');
      setLoading(false);

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  if (success) {
    return (
      <div className={`flex items-center justify-center gap-2 ${inline ? 'p-4 bg-green-50 rounded-xl' : 'p-6 bg-green-50 rounded-2xl'}`}>
        <FiCheck className="text-green-600 w-6 h-6" />
        <p className="text-green-800 font-medium">
          Thanks for subscribing! Check your email to confirm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-secondary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      <p className="text-xs mt-2 text-gray-500">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </form>
  );
}
