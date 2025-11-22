import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaStar, FaChevronRight } from 'react-icons/fa';
import { db } from '../../services/supabase';
import { states, getCitiesByState, getStateBySlug } from '../../data/locations';
import { categories } from '../../data/categories';
import VenueCard from '../../components/venue/VenueCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export default function StatePage() {
  const { state } = useParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateData, setStateData] = useState(null);
  const [stateCities, setStateCities] = useState([]);

  useEffect(() => {
    loadStateData();
  }, [state]);

  const loadStateData = async () => {
    setLoading(true);

    // Find state data
    const foundState = getStateBySlug(state);
    setStateData(foundState);

    // Find cities in this state
    const citiesInState = getCitiesByState(foundState?.id);
    setStateCities(citiesInState);

    // Load venues for this state
    if (foundState) {
      const { data, error } = await db.getVenues({
        state: foundState.id
      });

      if (!error && data) {
        setVenues(data);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stateData) {
    return (
      <div className="section-container py-12">
        <div className="text-center">
          <h1 className="page-title">State Not Found</h1>
          <p className="page-subtitle">We couldn't find that state.</p>
          <Link to="/search" className="btn-primary mt-6 inline-block">
            Browse All Activities
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Locations', path: '/locations' },
    { label: stateData.name }
  ];

  const popularCategories = categories.slice(0, 12);
  const popularCities = stateCities.filter(c => c.isPopular).slice(0, 12);
  const venueCount = venues.length;

  return (
    <>
      <Helmet>
        <title>Kids Sports & Activities in {stateData.name} | Kids Sports Zone</title>
        <meta
          name="description"
          content={`Find ${venueCount}+ kids sports and activities across ${stateData.name}. Swimming, soccer, dance, martial arts and more in ${stateData.capital} and beyond.`}
        />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="bg-warm-50 border-b border-warm-200">
        <div className="section-container py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="section-container py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-2xl" />
              <span className="text-primary-100 font-medium">{stateData.abbreviation}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Kids Sports & Activities in {stateData.name}
            </h1>
            <p className="text-xl text-primary-50 mb-6">
              Discover amazing sports and activities for children across {stateData.name}.
              From {stateData.capital} to regional areas, find the perfect program for your child.
            </p>
            <div className="flex flex-wrap gap-4 text-lg">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                <span>{venueCount}+ Venues</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                <span>{stateCities.length}+ Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                <span>{categories.length}+ Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by City */}
      <div className="section-container py-12">
        <h2 className="section-title">Browse by City</h2>
        <p className="section-subtitle">
          Explore kids activities in popular {stateData.name} locations
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {popularCities.map(city => (
            <Link
              key={city.slug}
              to={`/${state}/${city.slug}`}
              className="card hover:shadow-xl transition-all duration-300 p-6 text-center group"
            >
              <div className="text-4xl mb-3">🏙️</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 mb-1">
                {city.name}
              </h3>
              <p className="text-sm text-gray-500">
                {city.isPopular ? 'Popular location' : 'View activities'}
              </p>
            </Link>
          ))}
        </div>

        {stateCities.length > 12 && (
          <div className="text-center mt-8">
            <Link
              to={`/search?state=${state}`}
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All {stateCities.length} Locations
              <FaChevronRight />
            </Link>
          </div>
        )}
      </div>

      {/* Browse by Activity */}
      <div className="bg-warm-50 py-12">
        <div className="section-container">
          <h2 className="section-title">Browse by Activity</h2>
          <p className="section-subtitle">
            Popular kids sports and activities in {stateData.name}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {popularCategories.map(category => (
              <Link
                key={category.slug}
                to={`/${state}/${category.slug}`}
                className="card hover:shadow-xl transition-all duration-300 p-6 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Across {stateData.abbreviation}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Venues */}
      {venues.length > 0 && (
        <div className="section-container py-12">
          <h2 className="section-title">Featured Venues in {stateData.name}</h2>
          <p className="section-subtitle mb-8">
            Top-rated sports and activity centers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.slice(0, 9).map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          {venues.length > 9 && (
            <div className="text-center mt-8">
              <Link
                to={`/search?state=${state}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                View All {venueCount} Venues
                <FaChevronRight />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* SEO Content */}
      <div className="bg-warm-50 py-12">
        <div className="section-container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Kids Sports and Activities in {stateData.name}</h2>

            <p>
              {stateData.name} is home to hundreds of exceptional sports and activity venues for children.
              Whether you're in {stateData.capital} or regional areas, you'll find high-quality programs
              that help kids stay active, develop new skills, and make lifelong friends.
            </p>

            <h3>Why {stateData.name} is Great for Kids Activities</h3>
            <ul>
              <li>Diverse range of sports and activities available statewide</li>
              <li>World-class facilities in major cities and regional centers</li>
              <li>Qualified coaches with extensive experience</li>
              <li>Programs for all skill levels from beginner to elite</li>
              <li>Strong sporting culture and community support</li>
            </ul>

            <h3>Popular Kids Activities in {stateData.name}</h3>
            <p>
              Swimming is one of the most popular activities for kids in {stateData.name}, with programs
              available year-round at pools across the state. Team sports like soccer, AFL, and netball
              have strong community leagues and development pathways. Creative activities including dance,
              drama, and music provide excellent alternatives for children who prefer artistic pursuits.
            </p>

            <h3>Finding Activities Near You</h3>
            <p>
              Use our location filters to find activities in your suburb or city. Browse by activity type
              to discover new sports and programs, or search by age range to find age-appropriate options.
              Read reviews from other {stateData.name} parents to get insider insights before enrolling.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary-500 to-teal-600 text-white py-12">
        <div className="section-container text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Run a Sports Venue in {stateData.name}?
          </h2>
          <p className="text-xl text-teal-50 mb-6 max-w-2xl mx-auto">
            Join hundreds of {stateData.abbreviation} venues reaching families across the state
          </p>
          <Link to="/signup" className="btn-white inline-block">
            List Your Venue Free
          </Link>
        </div>
      </div>
    </>
  );
}
