/**
 * SEO and metadata utilities
 */

/**
 * Generate JSON-LD schema for local business
 * @param {Object} venue - Venue data
 * @returns {Object} JSON-LD schema
 */
export const generateLocalBusinessSchema = (venue) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: venue.name,
    description: venue.description,
    image: venue.featured_image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressRegion: venue.state_id?.toUpperCase(),
      postalCode: venue.postcode,
      addressCountry: 'AU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: venue.latitude,
      longitude: venue.longitude
    },
    telephone: venue.phone,
    url: venue.website,
    aggregateRating: venue.average_rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: venue.average_rating,
      reviewCount: venue.review_count
    } : undefined,
    priceRange: venue.price_range ? '$'.repeat(venue.price_range) : undefined
  };
};

/**
 * Generate breadcrumb schema
 * @param {Array} items - Breadcrumb items [{name, url}]
 * @returns {Object} JSON-LD schema
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate FAQ schema
 * @param {Array} faqs - FAQ items [{question, answer}]
 * @returns {Object} JSON-LD schema
 */
export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate offer schema
 * @param {Object} offer - Offer data
 * @returns {Object} JSON-LD schema
 */
export const generateOfferSchema = (offer, venue) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: offer.title,
    description: offer.description,
    seller: {
      '@type': 'Organization',
      name: venue.name
    },
    validFrom: offer.starts_at,
    validThrough: offer.expires_at,
    availability: 'https://schema.org/InStock'
  };
};

/**
 * Generate meta tags for a page
 * @param {Object} options - Meta options {title, description, image, url, type}
 * @returns {Object} Meta tags object
 */
export const generateMetaTags = (options) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    keywords = []
  } = options;

  const siteName = import.meta.env.VITE_SITE_NAME || 'Kids Sports Zone';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';

  return {
    title: `${title} | ${siteName}`,
    description,
    keywords: keywords.join(', '),
    canonical: url ? `${siteUrl}${url}` : siteUrl,

    // Open Graph
    'og:title': title,
    'og:description': description,
    'og:image': image || `${siteUrl}/og-image.jpg`,
    'og:url': url ? `${siteUrl}${url}` : siteUrl,
    'og:type': type,
    'og:site_name': siteName,

    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || `${siteUrl}/og-image.jpg`
  };
};

/**
 * Generate slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} Slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Generate SEO-friendly title for category pages
 * @param {string} category - Category name
 * @param {string} location - Location name
 * @returns {string} SEO title
 */
export const generateCategoryPageTitle = (category, location) => {
  return `Kids ${category} in ${location} | Junior ${category} Classes & Activities`;
};

/**
 * Generate SEO-friendly description for category pages
 * @param {string} category - Category name
 * @param {string} location - Location name
 * @returns {string} SEO description
 */
export const generateCategoryPageDescription = (category, location) => {
  return `Find the best kids ${category.toLowerCase()} classes and activities in ${location}. Compare prices, read reviews, and discover ${category.toLowerCase()} programs for children aged 1-18.`;
};
