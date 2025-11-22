import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin } from 'react-icons/fi';
import { getCategoryBySlug } from '../../data/categories';
import { getPopularCities } from '../../data/locations';
import { useSearchStore } from '../../store/searchStore';
import VenueCard from '../../components/venue/VenueCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { generateMetaTags, generateCategoryPageTitle, generateCategoryPageDescription, generateFAQSchema } from '../../utils/seo';

export default function CategoryPage() {
  const { category: categorySlug, state, city } = useParams();
  const { venues, loading, setFilter, searchVenues, clearFilters } = useSearchStore();
  const [category, setCategory] = useState(null);

  const popularCities = getPopularCities();

  useEffect(() => {
    const cat = getCategoryBySlug(categorySlug);
    setCategory(cat);

    // Set filters based on URL
    clearFilters();
    if (cat) setFilter('category', cat.slug);
    if (state) setFilter('state', state);
    if (city) setFilter('city', city);

    searchVenues();
  }, [categorySlug, state, city]);

  if (!category) {
    return (
      <div className="section-container py-12">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-display font-bold mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find that activity category.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const locationName = city || state || 'Australia';
  const pageTitle = generateCategoryPageTitle(category.name, locationName);
  const pageDescription = generateCategoryPageDescription(category.name, locationName);

  const metaTags = generateMetaTags({
    title: pageTitle,
    description: pageDescription,
    url: `/${state ? state + '/' : ''}${city ? city + '/' : ''}${categorySlug}`,
    keywords: [`kids ${category.name.toLowerCase()}`, `${category.name.toLowerCase()} classes`, `junior ${category.name.toLowerCase()}`, locationName]
  });

  // Sample FAQs (in production, these would come from database)
  const faqs = [
    {
      question: `What age is appropriate for ${category.name.toLowerCase()} classes?`,
      answer: `Most ${category.name.toLowerCase()} programs cater to children aged 3-18 years. Many venues offer different classes for various age groups, from toddlers to teenagers. Check individual venue listings for specific age requirements.`
    },
    {
      question: `How much do ${category.name.toLowerCase()} classes cost in ${locationName}?`,
      answer: `Prices vary depending on the venue, class duration, and frequency. Expect to pay anywhere from $15-50 per session. Many venues offer term packages which provide better value. Check our listings for current pricing and special offers.`
    },
    {
      question: `What should my child bring to ${category.name.toLowerCase()} classes?`,
      answer: `Requirements vary by venue, but typically include comfortable clothing, water bottle, and any sport-specific equipment. Many venues provide equipment for beginners. Check with your chosen venue for their specific requirements.`
    },
    {
      question: `Are there ${category.name.toLowerCase()} classes near me in ${locationName}?`,
      answer: `Yes! Use our search filters to find ${category.name.toLowerCase()} venues near you. We have listings across ${locationName} with detailed information about each program.`
    }
  ];

  const faqSchema = generateFAQSchema(faqs);

  const breadcrumbItems = [
    { name: category.name, url: `/${categorySlug}` }
  ];
  if (state) breadcrumbItems.push({ name: state, url: `/${state}` });
  if (city) breadcrumbItems.push({ name: city });

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        <link rel="canonical" href={metaTags.canonical} />

        <meta property="og:title" content={metaTags['og:title']} />
        <meta property="og:description" content={metaTags['og:description']} />
        <meta property="og:url" content={metaTags['og:url']} />

        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-400 to-secondary-400 text-white py-16">
        <div className="section-container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-center gap-4 mb-6">
            <div className="text-7xl">{category.icon}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Kids {category.name} in {locationName}
              </h1>
              <p className="text-xl opacity-95">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="badge bg-white text-primary-600 font-semibold">
              {venues.length} venues found
            </div>
            <div className="badge bg-white/20 text-white">
              Ages 1-18
            </div>
            <div className="badge bg-white/20 text-white">
              Indoor & Outdoor options
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Popular Cities (if viewing Australia-wide) */}
        {!city && !state && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              Browse {category.name} by City
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularCities.map(popularCity => (
                <Link
                  key={popularCity.id}
                  to={`/${popularCity.slug}/${categorySlug}`}
                  className="card hover:shadow-xl transition-all text-center py-4"
                >
                  <FiMapPin className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">{popularCity.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Venue Listings */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6">
            {category.name} Venues {city && `in ${city}`}
          </h2>

          {loading ? (
            <LoadingSpinner text={`Loading ${category.name.toLowerCase()} venues...`} />
          ) : venues.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-display font-semibold mb-2">
                No {category.name} venues found
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on adding more venues. Check back soon or try a nearby city.
              </p>
              <Link to="/search" className="btn-primary">
                Browse All Activities
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-display">Why Choose {category.name} for Your Child?</h2>
              <p>
                {category.name} is an excellent activity for children of all ages. It helps develop physical fitness,
                coordination, teamwork, and discipline. Whether your child is a complete beginner or has some experience,
                there's a program that's right for them in {locationName}.
              </p>

              <h3 className="font-display">What to Expect from {category.name} Classes</h3>
              <p>
                Quality {category.name.toLowerCase()} programs focus on skill development in a fun, supportive environment.
                Classes are typically structured by age and skill level, ensuring your child learns at an appropriate pace
                alongside peers of similar abilities.
              </p>

              <h3 className="font-display">Finding the Right {category.name} Program</h3>
              <p>
                When choosing a {category.name.toLowerCase()} program, consider factors like location, schedule flexibility,
                instructor qualifications, and class size. Read reviews from other parents, check facility amenities, and
                don't hesitate to observe a trial class before committing.
              </p>

              <h3 className="font-display">Benefits of {category.name} for Kids</h3>
              <ul>
                <li>Physical fitness and motor skill development</li>
                <li>Social interaction and teamwork</li>
                <li>Confidence building and self-discipline</li>
                <li>Goal setting and achievement</li>
                <li>Fun and healthy lifestyle habits</li>
              </ul>
            </div>
          </div>

          {/* Sidebar with CTA */}
          <div>
            <div className="card sticky top-24">
              <h3 className="font-display font-semibold text-lg mb-4">
                Own a {category.name} Venue?
              </h3>
              <p className="text-gray-600 mb-4">
                List your venue for free and reach thousands of parents looking for {category.name.toLowerCase()} classes.
              </p>
              <Link to="/signup" className="btn-primary w-full text-center block mb-3">
                List Your Venue
              </Link>
              <Link to="/signin" className="btn-outline w-full text-center block">
                Claim Existing Listing
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="card group">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                  <span>{faq.question}</span>
                  <span className="text-primary-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Categories */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-6">
            You Might Also Like
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/swimming" className="badge badge-primary text-base px-4 py-2 hover:scale-105 transition-transform">
              🏊 Swimming
            </Link>
            <Link to="/soccer" className="badge badge-secondary text-base px-4 py-2 hover:scale-105 transition-transform">
              ⚽ Soccer
            </Link>
            <Link to="/dance" className="badge badge-accent text-base px-4 py-2 hover:scale-105 transition-transform">
              💃 Dance
            </Link>
            <Link to="/martial-arts" className="badge bg-orange-100 text-orange-800 text-base px-4 py-2 hover:scale-105 transition-transform">
              🥋 Martial Arts
            </Link>
            <Link to="/search" className="badge bg-gray-100 text-gray-800 text-base px-4 py-2 hover:scale-105 transition-transform">
              View All Activities →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
