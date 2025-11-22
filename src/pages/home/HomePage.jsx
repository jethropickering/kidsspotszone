import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiMapPin, FiStar, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { categories, getPopularCategories } from '../../data/categories';
import { getPopularCities } from '../../data/locations';
import { useSearchStore } from '../../store/searchStore';
import { generateMetaTags, generateBreadcrumbSchema } from '../../utils/seo';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { setFilter, getUserLocation } = useSearchStore();

  const popularCategories = getPopularCategories();
  const popularCities = getPopularCities();

  const metaTags = generateMetaTags({
    title: 'Find Kids Sports & Activities Near You in Australia',
    description: 'Discover the best kids sports, activities and classes across Australia. Compare prices, read reviews, and find the perfect activity for your child aged 1-18.',
    url: '/',
    keywords: ['kids sports', 'kids activities', 'children activities', 'junior sports', 'kids classes', 'Australia']
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilter('search', searchQuery);
      navigate('/search');
    }
  };

  const handleNearMe = async () => {
    await getUserLocation();
    navigate('/search');
  };

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        <link rel="canonical" href={metaTags.canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTags['og:title']} />
        <meta property="og:description" content={metaTags['og:description']} />
        <meta property="og:image" content={metaTags['og:image']} />
        <meta property="og:url" content={metaTags['og:url']} />
        <meta property="og:type" content={metaTags['og:type']} />

        {/* Twitter Card */}
        <meta name="twitter:card" content={metaTags['twitter:card']} />
        <meta name="twitter:title" content={metaTags['twitter:title']} />
        <meta name="twitter:description" content={metaTags['twitter:description']} />
        <meta name="twitter:image" content={metaTags['twitter:image']} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 text-white py-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Find Amazing Activities for Your Kids
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Discover sports, classes, and activities across Australia.
              Perfect for children aged 1-18.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-3 shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for swimming, soccer, dance..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-gray-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNearMe}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <FiMapPin />
                  Near Me
                </button>
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-display">5,000+</div>
                <div className="text-sm md:text-base opacity-90">Venues Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-display">30+</div>
                <div className="text-sm md:text-base opacity-90">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-display">100+</div>
                <div className="text-sm md:text-base opacity-90">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-display">50,000+</div>
                <div className="text-sm md:text-base opacity-90">Happy Families</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Activities */}
      <section className="py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Popular Activities
            </h2>
            <p className="text-lg text-gray-600">
              Browse by category to find the perfect activity for your child
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map(category => (
              <Link
                key={category.id}
                to={`/${category.slug}`}
                className="card hover:scale-105 transform transition-all text-center"
                style={{ borderTop: `4px solid ${category.color}` }}
              >
                <div className="text-4xl md:text-5xl mb-3">{category.icon}</div>
                <h3 className="font-display font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/search" className="btn-outline inline-flex items-center gap-2">
              View All {categories.length} Activities
              <FiTrendingUp />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Find Activities in Your City
            </h2>
            <p className="text-lg text-gray-600">
              Explore kids activities in popular Australian cities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCities.map(city => (
              <Link
                key={city.id}
                to={`/locations/${city.slug}`}
                className="group bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FiMapPin className="text-secondary-600 w-6 h-6" />
                  <h3 className="font-display font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                    {city.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Browse activities near you
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-warm-100 to-primary-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Parents Love Kids Sports Zone
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">
                Easy to Search
              </h3>
              <p className="text-gray-600">
                Find activities by location, category, age range, and more.
                Our smart search makes it simple.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">
                Trusted Reviews
              </h3>
              <p className="text-gray-600">
                Read honest reviews from other parents to make informed decisions
                about your child's activities.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">
                Save Favorites
              </h3>
              <p className="text-gray-600">
                Create a personalized list of activities you're interested in
                and compare options easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section for Venue Owners */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Own a Sports Venue or Activity Center?
            </h2>
            <p className="text-xl mb-8 opacity-95">
              List your venue for free and reach thousands of parents looking for
              activities for their kids.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                List Your Venue Free
              </Link>
              <Link to="/about" className="border-2 border-white hover:bg-white hover:text-primary-600 font-medium px-8 py-4 rounded-xl transition-all duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display">Discover Kids Sports and Activities Across Australia</h2>
            <p>
              Kids Sports Zone is Australia's most comprehensive directory for children's sports
              and activities. Whether you're looking for swimming lessons in Sydney, soccer
              classes in Melbourne, or dance studios in Brisbane, we help you find the perfect
              activity for your child.
            </p>
            <h3 className="font-display">Find Activities for Every Age</h3>
            <p>
              Our platform features activities suitable for children from ages 1 to 18. From
              toddler classes to junior sports teams, we've got something for every stage of
              your child's development.
            </p>
            <h3 className="font-display">Compare and Choose with Confidence</h3>
            <p>
              Read reviews from other parents, compare prices, view photos, and get all the
              information you need to make the best choice for your family. Our detailed venue
              profiles include facilities, age ranges, pricing, and contact information.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
