/**
 * General helper utilities
 */

/**
 * Format price range to display
 * @param {number} range - Price range (1, 2, or 3)
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (range) => {
  if (!range) return '';
  return '$'.repeat(range);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncate = (text, length = 150) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format Australian phone numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }

  return phone;
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate Australian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidAustralianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  // Australian numbers are typically 10 digits starting with 0, or mobile starting with 04
  return /^0[2-478]\d{8}$/.test(cleaned);
};

/**
 * Share content on social media
 * @param {string} platform - Social platform (facebook, twitter, etc.)
 * @param {Object} data - Share data {url, title, description}
 */
export const shareOnSocial = (platform, data) => {
  const { url, title, description } = data;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
  };

  const shareUrl = shareUrls[platform];
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get age range label
 * @param {number} min - Minimum age
 * @param {number} max - Maximum age
 * @returns {string} Age range label
 */
export const getAgeRangeLabel = (min, max) => {
  if (min === max) return `Age ${min}`;
  if (min === 1 && max === 18) return 'All ages';
  return `Ages ${min}-${max}`;
};

/**
 * Generate Google Maps URL
 * @param {Object} venue - Venue data
 * @returns {string} Google Maps URL
 */
export const getGoogleMapsUrl = (venue) => {
  if (venue.latitude && venue.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
  }
  const address = `${venue.address}, ${venue.suburb}, ${venue.city}, ${venue.state_id}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

/**
 * Check if offer is expired
 * @param {string|Date} expiryDate - Expiry date
 * @returns {boolean} True if expired
 */
export const isOfferExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date();
};

/**
 * Get days until expiry
 * @param {string|Date} expiryDate - Expiry date
 * @returns {number} Days until expiry
 */
export const getDaysUntilExpiry = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
