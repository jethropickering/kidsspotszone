import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiMapPin, FiUser, FiHeart, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { getPopularCategories } from '../../data/categories';
import { states, getPopularCities } from '../../data/locations';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const popularCategories = getPopularCategories();
  const popularCities = getPopularCities();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-500 text-white py-2">
        <div className="section-container">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:1300KIDSSPORT" className="hover:underline">
                📞 1300 KIDS SPORT
              </a>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">
                Find the perfect sports activity for your kids
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="hover:underline">
                    My Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="hover:underline">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="hover:underline">
                    Sign In
                  </Link>
                  <Link to="/signup" className="hover:underline font-semibold">
                    List Your Venue
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-3xl">🏃</div>
            <div>
              <h1 className="text-2xl font-display font-bold text-primary-600">
                Kids Sports Zone
              </h1>
              <p className="text-xs text-gray-600">Find Activities Near You</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium py-4">
                Browse Activities
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu */}
              {megaMenuOpen && (
                <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl animate-fade-in">
                  <div className="bg-white shadow-2xl rounded-2xl p-8">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Popular Categories */}
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
                        Popular Activities
                      </h3>
                      <ul className="space-y-2">
                        {popularCategories.map(category => (
                          <li key={category.id}>
                            <Link
                              to={`/${category.slug}`}
                              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              <span className="text-xl">{category.icon}</span>
                              <span>{category.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Popular Cities */}
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
                        Popular Cities
                      </h3>
                      <ul className="space-y-2">
                        {popularCities.slice(0, 7).map(city => (
                          <li key={city.id}>
                            <Link
                              to={`/locations/${city.slug}`}
                              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              <FiMapPin className="text-secondary-500" />
                              <span>{city.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* States */}
                    <div>
                      <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">
                        Browse by State
                      </h3>
                      <ul className="space-y-2">
                        {states.map(state => (
                          <li key={state.id}>
                            <Link
                              to={`/locations/${state.slug}`}
                              className="text-gray-600 hover:text-primary-600 transition-colors"
                            >
                              {state.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/search" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1">
              <FiSearch />
              Search
            </Link>

            <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium">
              About
            </Link>

            <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
              Contact
            </Link>

            {user && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1">
                  <FiUser />
                  Dashboard
                </Link>
                <Link to="/dashboard#favorites" className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-1">
                  <FiHeart />
                  Favorites
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="section-container py-4">
            <nav className="flex flex-col gap-4">
              <Link
                to="/search"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiSearch />
                Search Activities
              </Link>

              {/* Mobile Categories */}
              <div className="border-t pt-4">
                <h3 className="font-display font-semibold mb-3 text-gray-900">
                  Popular Activities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularCategories.map(category => (
                    <Link
                      key={category.id}
                      to={`/${category.slug}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Cities */}
              <div className="border-t pt-4">
                <h3 className="font-display font-semibold mb-3 text-gray-900">
                  Popular Cities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularCities.slice(0, 6).map(city => (
                    <Link
                      key={city.id}
                      to={`/locations/${city.slug}`}
                      className="flex items-center gap-1 text-gray-600 hover:text-primary-600 py-2 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiMapPin className="text-secondary-500" />
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex flex-col gap-3">
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser />
                      My Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-primary-600 font-medium flex items-center gap-2 text-left"
                    >
                      <FiLogOut />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/signin"
                      className="btn-outline flex-1 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary flex-1 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
