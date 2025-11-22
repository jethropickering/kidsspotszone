import { FiTag, FiCalendar, FiClock } from 'react-icons/fi';
import { format, isPast, differenceInDays } from 'date-fns';

export default function OfferCard({ offer }) {
  const expiryDate = new Date(offer.expires_at);
  const isExpired = isPast(expiryDate);
  const daysUntilExpiry = differenceInDays(expiryDate, new Date());

  if (isExpired || !offer.is_active) {
    return null;
  }

  return (
    <div className={`card border-2 ${offer.is_promoted ? 'border-accent-400 bg-accent-50' : 'border-primary-200 bg-warm-50'}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-4 rounded-xl ${offer.is_promoted ? 'bg-accent-500' : 'bg-primary-500'} text-white flex-shrink-0`}>
          <FiTag className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Promoted badge */}
          {offer.is_promoted && (
            <span className="inline-block bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
              ✨ Featured Offer
            </span>
          )}

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
            {offer.title}
          </h3>

          {/* Description */}
          <p className="text-gray-700 mb-3 leading-relaxed">
            {offer.description}
          </p>

          {/* Discount/Value */}
          {offer.discount_percentage && (
            <div className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-lg mb-3">
              {offer.discount_percentage}% OFF
            </div>
          )}

          {/* Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {/* Expiry */}
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>
                Expires {format(expiryDate, 'MMM d, yyyy')}
              </span>
            </div>

            {/* Time urgency */}
            {daysUntilExpiry <= 7 && (
              <div className="flex items-center gap-1 text-red-600 font-semibold">
                <FiClock className="w-4 h-4" />
                <span>
                  {daysUntilExpiry === 0 && 'Expires today!'}
                  {daysUntilExpiry === 1 && 'Expires tomorrow!'}
                  {daysUntilExpiry > 1 && `Only ${daysUntilExpiry} days left!`}
                </span>
              </div>
            )}
          </div>

          {/* Terms */}
          {offer.terms && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-primary-600 font-medium">
                Terms & Conditions
              </summary>
              <p className="text-gray-600 mt-2 pl-4 border-l-2 border-gray-200 whitespace-pre-line">
                {offer.terms}
              </p>
            </details>
          )}

          {/* Promo Code */}
          {offer.promo_code && (
            <div className="mt-4 p-3 bg-white rounded-lg border-2 border-dashed border-primary-400">
              <div className="text-xs text-gray-600 mb-1">Use code:</div>
              <div className="flex justify-between items-center gap-4">
                <code className="font-mono font-bold text-lg text-primary-700">
                  {offer.promo_code}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(offer.promo_code);
                    alert('Promo code copied to clipboard!');
                  }}
                  className="btn-outline text-sm"
                >
                  Copy Code
                </button>
              </div>
            </div>
          )}

          {/* Redemption link */}
          {offer.redemption_url && (
            <a
              href={offer.redemption_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center block mt-4"
            >
              Claim This Offer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
