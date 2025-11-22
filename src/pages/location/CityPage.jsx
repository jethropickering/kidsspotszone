import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaStar, FaChevronRight } from 'react-icons/fa';
import { db } from '../../services/supabase';
import { getAllCities, getCityBySlug } from '../../data/locations';
import { categories } from '../../data/categories';
import VenueCard from '../../components/venue/VenueCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Breadcrumbs from '../../components/common/Breadcrumbs';

export default function CityPage() {
  const { state, city } = useParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityData, setCityData] = useState(null);

  useEffect(() => {
    loadCityData();
  }, [state, city]);

  const loadCityData = async () => {
    setLoading(true);

    // Find city data
    const foundCity = getCityBySlug(city);
    setCityData(foundCity);

    // Load venues for this city
    if (foundCity) {
      const { data, error } = await db.getVenues({
        city: city,
        state: state
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

  if (!cityData) {
    return (
      <div className="section-container py-12">
        <div className="text-center">
          <h1 className="page-title">City Not Found</h1>
          <p className="page-subtitle">We couldn't find that city.</p>
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
    { label: cityData.state, path: `/locations/${state}` },
    { label: cityData.name }
  ];

  const popularCategories = categories.slice(0, 12);
  const venueCount = venues.length;

  return (
    <>
      <Helmet>
        <title>Kids Sports & Activities in {cityData.name} | Kids Sports Zone</title>
        <meta
          name="description"
          content={`Discover ${venueCount}+ kids sports and activities in ${cityData.name}. Swimming, soccer, dance, martial arts and more for children aged 1-18.`}
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
              <span className="text-primary-100 font-medium">{cityData.state}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Kids Sports & Activities in {cityData.name}
            </h1>
            <p className="text-xl text-primary-50 mb-6">
              Find the perfect sport or activity for your child in {cityData.name}.
              Compare venues, read reviews, and discover special offers.
            </p>
            <div className="flex flex-wrap gap-4 text-lg">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                <span>{venueCount}+ Venues</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                <span>{popularCategories.length}+ Activities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="section-container py-12">
        <h2 className="section-title">Browse by Activity</h2>
        <p className="section-subtitle">
          Explore popular kids activities in {cityData.name}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {popularCategories.map(category => (
            <Link
              key={category.slug}
              to={`/${state}/${city}/${category.slug}`}
              className="card hover:shadow-xl transition-all duration-300 p-6 text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.slug === 'swimming' ? '50+' :
                 category.slug === 'soccer' ? '30+' :
                 category.slug === 'dance' ? '25+' : '15+'} venues
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Venues */}
      {venues.length > 0 && (
        <div className="bg-warm-50 py-12">
          <div className="section-container">
            <h2 className="section-title">Featured Venues in {cityData.name}</h2>
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
                  to={`/search?city=${city}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  View All {venueCount} Venues
                  <FaChevronRight />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="section-container py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2>Kids Sports and Activities in {cityData.name}</h2>

          <p>
            {cityData.name} offers a vibrant community of sports and activity venues for children
            of all ages. Whether you're looking for swimming lessons, soccer training, dance classes,
            or martial arts programs, you'll find quality options throughout {cityData.name}.
          </p>

          <h3>Why Choose {cityData.name} for Kids Activities?</h3>
          <ul>
            <li>Wide variety of sports and activity options for ages 1-18</li>
            <li>Experienced coaches and qualified instructors</li>
            <li>Modern facilities with safe, clean environments</li>
            <li>Flexible schedules including after-school and weekend programs</li>
            <li>Competitive pricing with regular special offers</li>
          </ul>

          <h3>Popular Activities in {cityData.name}</h3>
          <p>
            Parents in {cityData.name} love enrolling their kids in swimming lessons to build water
            confidence and safety skills. Soccer programs are also hugely popular, offering both
            recreational and competitive options. Dance classes provide creative expression and
            physical fitness, while martial arts programs teach discipline and self-defense.
          </p>

          <h3>Finding the Right Activity</h3>
          <p>
            Use our advanced search filters to find activities by age range, indoor/outdoor preference,
            price range, and specific location within {cityData.name}. Read reviews from other parents
            to make informed decisions, and take advantage of special offers to try new activities.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary-500 to-teal-600 text-white py-12">
        <div className="section-container text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Own a Venue in {cityData.name}?
          </h2>
          <p className="text-xl text-teal-50 mb-6 max-w-2xl mx-auto">
            List your sports or activity center for free and reach thousands of local families
          </p>
          <Link to="/signup" className="btn-white inline-block">
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}
