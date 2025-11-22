import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after 1 second delay
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="section-container">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:flex items-center justify-between gap-6">
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="font-display font-semibold text-lg mb-2">
              We value your privacy
            </h3>
            <p className="text-gray-600 text-sm">
              We use cookies to enhance your browsing experience, serve personalized content,
              and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                Read our Privacy Policy
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDecline}
              className="px-6 py-2 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
